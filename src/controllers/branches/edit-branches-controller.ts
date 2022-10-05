import { IBranch } from "../../models/branch";
import { ICountry } from "../../models/country";

import { IState } from "../../models/state";
import { BranchService } from "../../services/branch-service";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";

import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditBranchController {
  constructor(
    private branchService: BranchService,
    private stateService: StateService,
    private countryService: CountryServices
  ) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-branch-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    const countrySelect = <HTMLSelectElement>document.getElementById("country");
    countrySelect.addEventListener("change", this.onChangeCountrySelect);

    configureValidator("branchname");
    configureValidator("country");
    configureValidator("state");
    configureValidator("city");
    configureValidator("street");
  }

  private onClickSaveButton = async (event: Event) => {
    if (this.validateEditBranchForm()) {
      try {
        const branchNameInput = <HTMLInputElement>(
          document.querySelector("[name='branchname']")
        );
        const countryInputSelect = <HTMLSelectElement>(
          document.querySelector("[name='country']")
        );
        const stateInputSelect = <HTMLSelectElement>(
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
          countryId: countryInputSelect.value,
          stateId: stateInputSelect.value,
          city: cityInput.value,
          street: streetInput.value,
        };

        const id = this.getQueryParams().id;

        await this.branchService.updateBranch(id, branch);
        alert("Los datos fueron guardados");
        window.location.href = "/branches";
      } catch (error) {
        errorHandler(
          "No pudo ser guardado correctamente, por favor intente nuevamente",
          error
        );
      }
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
  private renderBranch(branchDataList: IBranch[]) {
    const branchTemplate = <HTMLTemplateElement>(
      document.getElementById("branch-template")
    );

    for (let i = 0; i < branchDataList.length; i++) {
      const copyBranchTemplate = document.importNode(
        branchTemplate.content,
        true
      );
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

  renderCountries(countryDataList: ICountry[]) {
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

  private onChangeCountrySelect = async (event: Event) => {
    const changeCountrySelect = <HTMLSelectElement>event.target;
    const countryId = changeCountrySelect.value;

    this.deleteStateSelectOptions();
    if (countryId !== "") {
      const stateData = await this.stateService.getStates(countryId);
      this.renderStates(stateData);
    }
  };
  async setState(countryId: string, stateId: string) {
    try {
      const states = await this.stateService.getStates(countryId);
      this.renderStates(states);
      const stateInput = <HTMLInputElement>(
        document.querySelector("[name='state']")
      );
      stateInput.value = stateId;
    } catch (error) {
      errorHandler("error al encontrar la data", error);
    }
  }

  getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }

  private validateEditBranchForm() {
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

  public async init() {
    const params = this.getQueryParams();
    const branchId = params.id;

    try {
      const branchData = await this.branchService.getBranch(branchId);
      const countryData = await this.countryService.getCountries();

      this.renderCountries(countryData);
      this.renderBranch(branchData);

      const branchInput = <HTMLInputElement>(
        document.querySelector("[name='branchname']")
      );
      branchInput.value = branchData.name;
      const countryInput = <HTMLInputElement>(
        document.querySelector("[name='country']")
      );
      countryInput.value = branchData.countryId;

      // this.setState(branchData.countryId, branchData.stateId);

      const cityInput = <HTMLInputElement>(
        document.querySelector("[name='city']")
      );
      cityInput.value = branchData.city;
      const streetInput = <HTMLInputElement>(
        document.querySelector("[name='street']")
      );
      streetInput.value = branchData.street;
    } catch (error) {
      errorHandler("error al encontrar la data", error);
    } finally {
      this.removeActivityIndicationMessage();
    }
  }

  private removeActivityIndicationMessage() {
    const waitingIndicationMessage = document.getElementById(
      "Activity-indication-message"
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }

    const editBranchForm = <HTMLSelectElement>(
      document.querySelector("[name='edit-branch-form']")
    );
    editBranchForm.setAttribute("class", "");
  }
}
const editBranchCtrl = new EditBranchController(
  new BranchService(),
  new StateService(),
  new CountryServices()
);
editBranchCtrl.init();
