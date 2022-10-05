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

  private onClickCreateBrunchButton = () => {
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
    try {
      const branchNameInput = <HTMLInputElement>(
        document.querySelector("[name='branchname']")
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

      const branch: IBranch = {
        id: "",
        name: branchNameInput.value,
        countryId: countrySelector.value,
        stateId: stateSelector.value,
        city: cityInput.value,
        street: streetInput.value,
      };

      await this.branchService.createBranch(branch);
      alert("Los datos fueron guardados");
      window.location.href = "/branches";
    } catch (error) {
      errorHandler("No se pudieron cargar los datos", error);
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

private  deleteStateSelectOptions() {
    const stateSelect = <HTMLSelectElement> document.getElementById("state");
    const selectOptions = stateSelect.querySelectorAll("option");
    selectOptions.forEach((option) => {
      if (option.id === "select-state") {
        console.log("no elimina", option.id);
      } else {
        option.remove();
      }
    });
  }

public  async init() {
    try {
      const countryData = await this.countryService.getCountries();
      this.renderCountries(countryData);
    } catch (error) {
      errorHandler("error al sincronizar datos", error);
    }
  }

private  renderCountries(countryDataList:ICountry[]) {
    const countrySelect = <HTMLSelectElement> document.getElementById("country");

    const countryTemplate = <HTMLTemplateElement>document.getElementById("country-create-template");

    for (let i = 0; i < countryDataList.length; i++) {
      const copyCountryTemplate = document.importNode(
        countryTemplate.content,
        true
      );

      const newCountryOption = <HTMLOptionElement>copyCountryTemplate.querySelector("option");

      newCountryOption.textContent = `${countryDataList[i].name}`;
      newCountryOption.setAttribute("value", `${countryDataList[i].id}`);
      countrySelect.append(newCountryOption);
    }
  }

private  renderStates(statesDataList: IState[]) {
    const statesSelect = <HTMLSelectElement>document.getElementById("state");

    const statesOptionTemplate = <HTMLTemplateElement>document.getElementById(
      "states-option-template"
    );

    for (let i = 0; i < statesDataList.length; i++) {
      const copyStatesOptionTemplate = document.importNode(
        statesOptionTemplate.content,
        true
      );
      const newStateOption = <HTMLOptionElement> copyStatesOptionTemplate.querySelector("option");

      newStateOption.textContent = `${statesDataList[i].name}`;
      newStateOption.setAttribute("value", `${statesDataList[i].id}`);
      statesSelect.append(newStateOption);
    }
  }
}

const createBrunchesCtrl = new CreateBrunchesController(
  new CountryServices(),
  new StateService(),
  new BranchService()
);
createBrunchesCtrl.init();
