import { ICountry } from "../../models/country";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { errorHandler } from "../../utils/error-handler";

class ListCountryController {
  countryService;
  stateService;
  constructor(countryService: CountryServices, stateService: StateService) {
    this.countryService = countryService;
    this.stateService = stateService;
    const createButton = document.getElementById("create-button");
    createButton?.addEventListener("click", this.onClickCreateButton);
  }

  onClickStatesButton(event: Event) {
    const countryId = (<HTMLButtonElement>event.target).getAttribute(
      "data-country-id"
    );
    window.location.href = `/states/?countryId=${countryId}`;
  }

  onClickCreateButton() {
    window.location.href = "/countries/create";
  }

  renderCountries(countriesList: ICountry[]) {
    const countryTable = <HTMLTableElement>(
      document.getElementById("country-table")
    );
    const countryRowTemplate = <HTMLTemplateElement>(
      document.getElementById("country-row-template")
    );

    for (let i = 0; i < countriesList.length; i++) {
      const copyRowTemplate = document.importNode(
        countryRowTemplate?.content,
        true
      );

      const nameTd = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='name']")
      );

      nameTd.textContent = countriesList[i].name;

      const editCountryButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-country-button']")
      );
      editCountryButton.setAttribute("data-id", countriesList[i].id);
      editCountryButton.addEventListener("click", this.onClickEditButton);

      const deleteCountryButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-country-button']")
      );

      deleteCountryButton.setAttribute("data-id", countriesList[i].id);
      deleteCountryButton.addEventListener("click", this.onClickDeleteButton);

      const statesButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='states-button']")
      );

      statesButton.setAttribute("data-country-id", countriesList[i].id);
      statesButton.addEventListener("click", this.onClickStatesButton);
      countryTable.append(copyRowTemplate);
    }
  }

  onClickEditButton = (event: Event) => {
    const id = (<HTMLButtonElement>event.target).getAttribute("data-id");
    window.location.href = `http://localhost:8080/countries/edit/?id=${id}`;
  };

  onClickDeleteButton = async (event: Event) => {
    const id = (<HTMLButtonElement>event.target).getAttribute("data-id");
    try {
      if (id !== null) {
        await this.countryService.deleteCountry(id);
      }
      alert("Country deleted");
      window.location.href = "/countries";
    } catch (error) {
      errorHandler("No se pudo eliminar el país, intente mas tarde.", error);
    }
  };

  async init() {
    try {
      const countriesDataList = await this.countryService.getCountries();
      if (countriesDataList.length === 0) {
        const elementNoCountriesAvailableMessage = document.querySelector(
          "#no-countries-available"
        );
        if (elementNoCountriesAvailableMessage !== null) {
          elementNoCountriesAvailableMessage.setAttribute("class", "");
        }
      }

      this.renderCountries(countriesDataList);
    } catch (error) {
      errorHandler("No podemos encontrar los datos, intente nuevamente", error);
    } finally {
      this.removeActivityIndicationMessage();
    }
  }

  removeActivityIndicationMessage() {
    const waitingIndicationMessage = document.getElementById(
      "waiting-message-row"
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }
  }
}

const listCountryCtrl = new ListCountryController(
  new CountryServices(),
  new StateService()
);
listCountryCtrl.init();
