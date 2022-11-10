import { Toast } from "bootstrap";
import { IBranch } from "../../models/branch";
import { ICountry } from "../../models/country";
import { IState } from "../../models/state";
import { BranchService } from "../../services/branch-service";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class CreateBrunchesController {
  constructor(
    private countryService: CountryServices,
    private stateService: StateService,
    private branchService: BranchService
  ) {
    const createBrunchButton = <HTMLButtonElement>(
      document.getElementById("create-branch-button")
    );
    createBrunchButton.addEventListener(
      "click",
      this.onClickCreateBrunchButton
    );

    const countrySelect = <HTMLSelectElement>document.getElementById("country");
    countrySelect.addEventListener("change", this.onChangeCountrySelect);

    configureValidator("branchname");
    configureValidator("country");
    configureValidator("state");
    configureValidator("city");
    configureValidator("street");
  }

  private onClickCreateBrunchButton = (event: Event) => {
    event.preventDefault();
    if (this.validateCreateBranchesForm() === true) {
      this.sendBranchData();
    }
  };

  private validateCreateBranchesForm() {
    let isFormValid = true;

    if (validateFieldRequired("branchname") === false) {
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

    return isFormValid;
  }

  private sendBranchData = async () => {
    const toastModalElement = <HTMLDivElement>(
      document.querySelector("#create-toast")
    );
    const toast = new Toast(toastModalElement);
    try {
      const branchNameInputElement = <HTMLInputElement>(
        document.querySelector("[name='branchname']")
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

      const branch: IBranch = {
        id: "",
        name: branchNameInputElement.value,
        countryId: countrySelectorElement.value,
        stateId: stateSelectorElement.value,
        city: cityInputElement.value,
        street: streetInputElement.value,
      };

      await this.branchService.createBranch(branch);
    } catch (error) {
      errorHandler("No se pudieron cargar los datos", error);
    } finally {
      if (toastModalElement !== null) {
        toast.show();
      }
      setTimeout(() => {
        window.location.href = "http://localhost:8080/branches/";
      }, 1000);
    }
  };

  private onChangeCountrySelect = async (event: Event) => {
    this.deleteStateSelectOptions();

    const countrySelectElement = <HTMLSelectElement>event.target;
    const countryId = countrySelectElement.value;

    if (countryId !== "") {
      const stateData = await this.stateService.getStates(countryId);
      this.renderStates(stateData);
    }
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
    try {
      const countryData = await this.countryService.getCountries();
      this.renderCountries(countryData);
    } catch (error) {
      errorHandler("error al sincronizar datos", error);
    }
  }

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
      const newStateOptionElement = <HTMLOptionElement>(
        copyStatesOptionTemplate.querySelector("option")
      );

      newStateOptionElement.textContent = `${statesDataList[i].name}`;
      newStateOptionElement.setAttribute("value", `${statesDataList[i].id}`);
      statesSelectElement.append(newStateOptionElement);
    }
  }
}

const createBrunchesCtrl = new CreateBrunchesController(
  new CountryServices(),
  new StateService(),
  new BranchService()
);
createBrunchesCtrl.init();
