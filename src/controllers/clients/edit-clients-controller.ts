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
import {
  getSelectValues,
  setSelectValues,
} from "../../utils/getSelectedOptions";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditClientController {
  constructor(
    private clientService: ClientService,
    private countryService: CountryServices,
    private stateService: StateService,
    private categorieService: CategoriesServices
  ) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-client-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("client-name", [{type: "required"}]);
    configureValidator("email", [{type: "required"}]);
    configureValidator("country", [{type: "required"}]);
    configureValidator("state", [{type: "required"}]);
    configureValidator("city", [{type: "required"}]);
    configureValidator("street", [{type: "required"}]);
    configureValidator("liked-categories", [{type: "required"}]);
  }

  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }
  private onClickSaveButton = async () => {
    if (this.validateEditClientsForm()) {
      try {
        const clientNameInputElement = <HTMLInputElement>(
          document.querySelector("[name='client-name']")
        );
        const emailInputElement = <HTMLInputElement>(
          document.querySelector("[name='email']")
        );
        const countrySelectElement = <HTMLSelectElement>(
          document.querySelector("[name='country']")
        );
        const stateSelectElement = <HTMLSelectElement>(
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

        const likedCategoriesList = getSelectValues(likedCategoriesSelectorElement);

        const client: IClient = {
          id: "",
          name: clientNameInputElement.value,
          email: emailInputElement.value,
          countryId: countrySelectElement.value,
          stateId: stateSelectElement.value,
          cityName: cityInputElement.value,
          street: streetInputElement.value,
          likedCategories: likedCategoriesList,
        };

        const id = this.getQueryParams().id;

        await this.clientService.updateClient(id, client);
        alert("Los datos fueron guardados");
        window.location.href = "/clients";
      } catch (error) {
        errorHandler(
          "El cliente no pudo ser guardado correctamente, por favor intente nuevamente",
          error
        );
      }
    }
  };
  public async init() {
    const params = this.getQueryParams();

    try {
      const clientData = await this.clientService.getClient(params.id);

      /** Input name */
      const clientInputElement = <HTMLInputElement>(
        document.querySelector("[name='client-name']")
      );
      clientInputElement.value = clientData.name;

      /** Input email */
      const emailInputElement = <HTMLInputElement>(
        document.querySelector("[name='email']")
      );
      emailInputElement.value = clientData.email;

      /**Input country */
      const countriesList = await this.countryService.getCountries();
      this.renderCountries(countriesList);

      const countrySelectElement = <HTMLSelectElement>(
        document.querySelector("[name='country']")
      );
      countrySelectElement.value = clientData.countryId;

      /**Input state */
      const stateList = await this.stateService.getStates(clientData.countryId);
      this.renderStates(stateList);
      const stateSelectElement = <HTMLSelectElement>(
        document.querySelector("[name='state']")
      );

      stateSelectElement.value = clientData.countryId;

      /**Input city */
      const cityInputElement = <HTMLInputElement>(
        document.querySelector("[name='city']")
      );
      cityInputElement.value = clientData.cityName;

      /**Input street */
      const streetInputElement = <HTMLInputElement>(
        document.querySelector("[name='street']")
      );
      streetInputElement.value = clientData.street;

      /**Input liked categories */
      const categoriesList = await this.categorieService.getCategories();
      this.renderCategories(categoriesList);

      const likedCategoriesSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='liked-categories']")
      );

      setSelectValues(
        likedCategoriesSelectorElement,
        clientData.likedCategories
      );
    } catch (error) {
      errorHandler("error al encontrar la data", error);
    } finally {
      this.removeActivityIndicationMessage();
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

      const newCategoryOption = <HTMLOptionElement>(
        copyCategoryTemplate.querySelector("option")
      );

      newCategoryOption.textContent = `${catergoriesDataList[i].name}`;
      newCategoryOption.setAttribute("value", `${catergoriesDataList[i].id}`);
      categorySelectElement.append(newCategoryOption);
    }
  }

  private renderCountries(countryDataList: ICountry[]) {
    const countrySelectElement = <HTMLSelectElement>document.getElementById("country");

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
    const statesSelectElement = <HTMLSelectElement>document.getElementById("state");

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
  private validateEditClientsForm() {
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
  private removeActivityIndicationMessage() {
    const waitingIndicationMessage = <HTMLDivElement>(
      document.getElementById("Activity-indication-message")
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }
  }
}
const editClientCtrl = new EditClientController(
  new ClientService(),
  new CountryServices(),
  new StateService(),
  new CategoriesServices()
);

editClientCtrl.init();
