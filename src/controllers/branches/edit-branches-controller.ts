// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
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
        const branchNameInputElement = <HTMLInputElement>(
          document.querySelector("[name='branchname']")
        );
        const countrySelectElement = <HTMLSelectElement>(
          document.querySelector("[name='country']")
        );
        const stateSelecteLElement = <HTMLSelectElement>(
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
          countryId: countrySelectElement.value,
          stateId: stateSelecteLElement.value,
          city: cityInputElement.value,
          street: streetInputElement.value,
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

  private onChangeCountrySelect = async (event: Event) => {
    const changeCountrySelectElement = <HTMLSelectElement>event.target;
    const countryId = changeCountrySelectElement.value;

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

  private getQueryParams() {
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
      const countriesData = await this.countryService.getCountries();
      const statesData = await this.stateService.getStates(branchData.countryId);

      this.renderCountries(countriesData);      
      this.renderStates(statesData);

      const branchInputElement = <HTMLInputElement>(
        document.querySelector("[name='branchname']")
      );
      branchInputElement.value = branchData.name;
      const countrySelectElement = <HTMLSelectElement>(
        document.querySelector("[name='country']")
      );
      countrySelectElement.value = branchData.countryId;

      const stateSelectElement = <HTMLSelectElement>(
        document.querySelector("[name='state']")
      );
      stateSelectElement.value = branchData.stateId;

      // this.setState(branchData.countryId, branchData.stateId);

      const cityInputElement = <HTMLInputElement>(
        document.querySelector("[name='city']")
      );
      cityInputElement.value = branchData.city;
      const streetInputElement = <HTMLInputElement>(
        document.querySelector("[name='street']")
      );
      streetInputElement.value = branchData.street;
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
