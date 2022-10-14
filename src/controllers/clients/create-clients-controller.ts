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

    configureValidator("client-name", ["required"]);
    configureValidator("email", ["required"]);
    configureValidator("country", ["required"]);
    configureValidator("state", ["required"]);
    configureValidator("city", ["required"]);
    configureValidator("street", ["required"]);
    configureValidator("liked-categories", ["required"]);
  }

  private onClickCreateClientButton = () => {
    if (this.validateCreateClientsForm() === true) {
      this.sendClientData();
    }
  };
  private onChangeCountrySelect = async (event: Event) => {
    this.deleteStateSelectOptions();
    const countrySelectElement = <HTMLSelectElement>event.target;
    const countryId = countrySelectElement.value;
    const statesList = await this.stateService.getStates(countryId);
    this.renderStates(statesList);
  };
  private deleteStateSelectOptions() {
    const stateSelect = <HTMLSelectElement>document.getElementById("state");
    const selectOptions = stateSelect.querySelectorAll("option");
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
    try {
      const clientNameInput = <HTMLInputElement>(
        document.querySelector("[name='client-name']")
      );
      const emailInput = <HTMLInputElement>(
        document.querySelector("[name='email']")
      );
      const countrySelector = <HTMLSelectElement>(
        document.querySelector("[name='country']")
      );
      const stateSelector = <HTMLSelectElement>(
        document.querySelector("[name='state']")
      );
      const cityInput = <HTMLInputElement>(
        document.querySelector("[name='city']")
      );
      const streetInput = <HTMLInputElement>(
        document.querySelector("[name='street']")
      );
      const likedCategoriesSelector = <HTMLSelectElement>(
        document.querySelector("[name='liked-categories']")
      );

      const likedCategoriesList = getSelectValues(likedCategoriesSelector);      

      const client: IClient = {
        id: "",
        name: clientNameInput.value,
        email: emailInput.value,
        countryId: countrySelector.value,
        stateId: stateSelector.value,
        cityName: cityInput.value,
        street: streetInput.value,
        likedCategories: likedCategoriesList,
      };

      await this.clientService.createClient(client);
      alert("Los datos fueron guardados");
      window.location.href = "/clients";
    } catch (error) {
      errorHandler("No se pudieron cargar los datos", error);
    }
  };

  private renderCountries(countryDataList: ICountry[]) {
    const countrySelect = <HTMLSelectElement>document.getElementById("country");

    const countryTemplate = <HTMLTemplateElement>(
      document.getElementById("country-create-template")
    );

    for (let i = 0; i < countryDataList.length; i++) {
      const copyCountryTemplate = document.importNode(
        countryTemplate.content,
        true
      );

      const newCountryOption = <HTMLOptionElement>(
        copyCountryTemplate.querySelector("option")
      );

      newCountryOption.textContent = `${countryDataList[i].name}`;
      newCountryOption.setAttribute("value", `${countryDataList[i].id}`);
      countrySelect.append(newCountryOption);
    }
  }
  private renderStates(statesDataList: IState[]) {
    const statesSelect = <HTMLSelectElement>document.getElementById("state");

    const statesOptionTemplate = <HTMLTemplateElement>(
      document.getElementById("states-option-template")
    );

    for (let i = 0; i < statesDataList.length; i++) {
      const copyStatesOptionTemplate = document.importNode(
        statesOptionTemplate.content,
        true
      );
      const newStateOption = <HTMLOptionElement>(
        copyStatesOptionTemplate.querySelector("option")
      );

      newStateOption.textContent = `${statesDataList[i].name}`;
      newStateOption.setAttribute("value", `${statesDataList[i].id}`);
      statesSelect.append(newStateOption);
    }
  }
  private renderCategories(catergoriesDataList: ICategory[]) {
    const categorySelect = <HTMLSelectElement>(
      document.getElementById("liked-categories")
    );

    const categoryOptionTemplate = <HTMLTemplateElement>(
      document.getElementById("category-option-template")
    );

    for (let i = 0; i < catergoriesDataList.length; i++) {
      const copyCategoryTemplate = document.importNode(
        categoryOptionTemplate.content,
        true
      );

      const newCategoryOption = <HTMLOptionElement>(
        copyCategoryTemplate.querySelector("option")
      );

      newCategoryOption.textContent = `${catergoriesDataList[i].name}`;
      newCategoryOption.setAttribute("value", `${catergoriesDataList[i].id}`);
      categorySelect.append(newCategoryOption);
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
