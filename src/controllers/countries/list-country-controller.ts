// Import all of Bootstrap's JS
import { Modal, Toast } from "bootstrap";
import { ICountry } from "../../models/country";
import { CountryServices } from "../../services/country-service";
import { errorHandler } from "../../utils/error-handler";

class ListCountryController {
  constructor(private countryService: CountryServices) {
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);
  }

  private onClickStatesButton(event: Event) {
    const countryId = (<HTMLButtonElement>event.target).getAttribute(
      "data-country-id"
    );
    window.location.href = `/states/?countryId=${countryId}`;
  }

  private onClickCreateButton() {
    window.location.href = "/countries/create";
  }

  private renderCountries(countriesList: ICountry[]) {
    const countryTableBobyElement = <HTMLTableElement>(
      document.querySelector("#country-table tbody")
    );
    const countryRowTemplateElement = <HTMLTemplateElement>(
      document.getElementById("country-row-template")
    );

    for (let i = 0; i < countriesList.length; i++) {
      const copyRowTemplate = document.importNode(
        countryRowTemplateElement?.content,
        true
      );

      const nameTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='name']")
      );

      nameTdElement.textContent = countriesList[i].name;

      const editCountryButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-country-button']")
      );
      editCountryButton.setAttribute("data-id", countriesList[i].id);
      editCountryButton.addEventListener("click", this.onClickEditButton);
      editCountryButton.classList.add("btn");
      editCountryButton.classList.add("btn-secondary");

      const deleteCountryButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-country-button']")
      );

      deleteCountryButton.setAttribute("data-id", countriesList[i].id);
      deleteCountryButton.setAttribute("data-name", countriesList[i].name);
      deleteCountryButton.addEventListener("click", this.onClickDeleteButton);
      deleteCountryButton.classList.add("btn");
      deleteCountryButton.classList.add("btn-secondary");

      const statesButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='states-button']")
      );

      statesButton.setAttribute("data-country-id", countriesList[i].id);
      statesButton.addEventListener("click", this.onClickStatesButton);
      statesButton.classList.add("btn");
      statesButton.classList.add("btn-secondary");

      countryTableBobyElement.append(copyRowTemplate);
    }
  }

  private onClickEditButton = (event: Event) => {
    const id = (<HTMLButtonElement>event.target).getAttribute("data-id");
    window.location.href = `http://localhost:8080/countries/edit/?id=${id}`;
  };

  private onClickDeleteButton = async (event: Event) => {
    const deleteButton = <HTMLButtonElement>event.target;
    const dataName = deleteButton.getAttribute("data-name");

    const myModalDeleteElement = <HTMLDivElement>(
      document.getElementById("delete-modal")
    );

    if (myModalDeleteElement !== null) {
      const myDeleteModal = new Modal(myModalDeleteElement);

      const modalBodyElement = <HTMLDivElement>(
        myModalDeleteElement.querySelector("div.modal-body")
      );
      modalBodyElement.textContent = `Quiere eliminar el país: ${dataName} ?`;

      const modalButtonYesElement = <HTMLButtonElement>(
        myModalDeleteElement.querySelector("#button-yes")
      );
      const toastModalElement = <HTMLDivElement>(
        document.querySelector("#delete-toast")
      );
      const toast = new Toast(toastModalElement);
      modalButtonYesElement.addEventListener("click", async () => {
        myDeleteModal.hide();
        try {
          const idToDelete = deleteButton.getAttribute("data-id");
          if (idToDelete !== null) {
            await this.countryService.deleteCountry(idToDelete);
          }
        } catch (error) {
          errorHandler("No se pudo eliminar el país", error);
        } finally {
          if (toastModalElement !== null) {
            toast.show();
          }
          setTimeout(() => {
            window.location.href = "http://localhost:8080/countries/";
          }, 1000);
        }
      });

      myDeleteModal.show();
    }
  };

  public async init() {
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

  private removeActivityIndicationMessage() {
    const waitingIndicationMessage = <HTMLDivElement>(
      document.getElementById("waiting-message-row")
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }
  }
}

const listCountryCtrl = new ListCountryController(new CountryServices());
listCountryCtrl.init();
