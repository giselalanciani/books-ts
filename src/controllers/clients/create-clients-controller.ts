import { Toast } from "bootstrap";
import { ICategory } from "../../models/category";
import { IClient } from "../../models/client";
import { ICountry } from "../../models/country";
import { IState } from "../../models/state";
import { CategoriesServices } from "../../services/categories-service";
import { ClientService } from "../../services/clients";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { getSelectValues } from "../../utils/getSelectedOptions";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class CreateClientController {
  constructor(
    private clientService: ClientService,
    private countryService: CountryServices,
    private stateService: StateService,
    private categorieService: CategoriesServices
  ) {
    const createClientButton = <HTMLButtonElement>(
      document.getElementById("create-client-button")
    );
    createClientButton.addEventListener(
      "click",
      this.onClickCreateClientButton
    );

    configureValidator("client-name", [{ type: "required" }]);
    configureValidator("email", [{ type: "required" }]);
    configureValidator("country", [{ type: "required" }]);
    configureValidator("state", [{ type: "required" }]);
    configureValidator("city", [{ type: "required" }]);
    configureValidator("street", [{ type: "required" }]);
    configureValidator("liked-categories", [{ type: "required" }]);
  }

  private onClickCreateClientButton = (event: Event) => {
    event.preventDefault();
    if (this.validateCreateClientsForm() === true) {
      this.sendClientData();
    }
  };
  private onChangeCountrySelect = async (event: Event) => {
    this.deleteStateSelectOptions();
    const countrySelectElementElement = <HTMLSelectElement>event.target;
    const countryId = countrySelectElementElement.value;
    const statesList = await this.stateService.getStates(countryId);
    this.renderStates(statesList);
  };
  private deleteStateSelectOptions() {
    const stateSelectElement = <HTMLSelectElement>(
      document.getElementById("state")
    );
    const selectOptions = stateSelectElement.querySelectorAll("option");
    selectOptions.forEach((option) => {
      if (option.id === "select-state") {
        console.log("no elimina", option.id);
      } else {
        option.remove();
      }
    });
  }

  public async init() {
    const countrySelectElement = <HTMLSelectElement>(
      document.getElementById("country")
    );
    countrySelectElement.addEventListener("change", this.onChangeCountrySelect);

    try {
      const countryData = await this.countryService.getCountries();

      this.renderCountries(countryData);

      const categoryData = await this.categorieService.getCategories();
      this.renderCategories(categoryData);
    } catch (error) {
      errorHandler("error al sincronizar datos", error);
    }
  }

  private sendClientData = async () => {
    const toastModalElement = <HTMLDivElement>(
      document.querySelector("#delete-toast")
    );
    const toast = new Toast(toastModalElement);
    try {
      const clientNameInputElement = <HTMLInputElement>(
        document.querySelector("[name='client-name']")
      );
      const emailInputElement = <HTMLInputElement>(
        document.querySelector("[name='email']")
      );
      const countrySelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='country']")
      );
      const stateSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='state']")
      );
      const cityInputElement = <HTMLInputElement>(
        document.querySelector("[name='city']")
      );
      const streetInputElement = <HTMLInputElement>(
        document.querySelector("[name='street']")
      );
      const likedCategoriesSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='liked-categories']")
      );

      const likedCategoriesList = getSelectValues(
        likedCategoriesSelectorElement
      );

      const client: IClient = {
        id: "",
        name: clientNameInputElement.value,
        email: emailInputElement.value,
        countryId: countrySelectorElement.value,
        stateId: stateSelectorElement.value,
        cityName: cityInputElement.value,
        street: streetInputElement.value,
        likedCategories: likedCategoriesList,
      };

      await this.clientService.createClient(client);
    } catch (error) {
      errorHandler("No se pudieron cargar los datos", error);
    } finally {
      if (toastModalElement !== null) {
        toast.show();
      }
      setTimeout(() => {
        window.location.href = "http://localhost:8080/clients/";
      }, 1000);
    }
  };

  private renderCountries(countryDataList: ICountry[]) {
    const countrySelectElement = <HTMLSelectElement>(
      document.getElementById("country")
    );

    const countryTemplateElement = <HTMLTemplateElement>(
      document.getElementById("country-create-template")
    );

    for (let i = 0; i < countryDataList.length; i++) {
      const copyCountryTemplate = document.importNode(
        countryTemplateElement.content,
        true
      );

      const newCountryOptionElement = <HTMLOptionElement>(
        copyCountryTemplate.querySelector("option")
      );

      newCountryOptionElement.textContent = `${countryDataList[i].name}`;
      newCountryOptionElement.setAttribute("value", `${countryDataList[i].id}`);
      countrySelectElement.append(newCountryOptionElement);
    }
  }
  private renderStates(statesDataList: IState[]) {
    const statesSelectElement = <HTMLSelectElement>(
      document.getElementById("state")
    );

    const statesOptionTemplateElement = <HTMLTemplateElement>(
      document.getElementById("states-option-template")
    );

    for (let i = 0; i < statesDataList.length; i++) {
      const copyStatesOptionTemplate = document.importNode(
        statesOptionTemplateElement.content,
        true
      );
      const newStateOption = <HTMLOptionElement>(
        copyStatesOptionTemplate.querySelector("option")
      );

      newStateOption.textContent = `${statesDataList[i].name}`;
      newStateOption.setAttribute("value", `${statesDataList[i].id}`);
      statesSelectElement.append(newStateOption);
    }
  }
  private renderCategories(catergoriesDataList: ICategory[]) {
    const categorySelectElement = <HTMLSelectElement>(
      document.getElementById("liked-categories")
    );

    const categoryOptionTemplateElement = <HTMLTemplateElement>(
      document.getElementById("category-option-template")
    );

    for (let i = 0; i < catergoriesDataList.length; i++) {
      const copyCategoryTemplate = document.importNode(
        categoryOptionTemplateElement.content,
        true
      );

      const newCategoryOptionElement = <HTMLOptionElement>(
        copyCategoryTemplate.querySelector("option")
      );

      newCategoryOptionElement.textContent = `${catergoriesDataList[i].name}`;
      newCategoryOptionElement.setAttribute(
        "value",
        `${catergoriesDataList[i].id}`
      );
      categorySelectElement.append(newCategoryOptionElement);
    }
  }
  private validateCreateClientsForm() {
    let isFormValid = true;

    if (validateFieldRequired("client-name") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("email") === false) {
      isFormValid = false;
    }

    if (validateFieldRequired("country") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("state") === false) {
      isFormValid = false;
    }

    if (validateFieldRequired("city") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("street") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("liked-categories") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }
}
const createClientCtrl = new CreateClientController(
  new ClientService(),
  new CountryServices(),
  new StateService(),
  new CategoriesServices()
);
createClientCtrl.init();
