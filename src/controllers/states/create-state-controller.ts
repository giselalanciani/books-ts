import { ICountry } from "../../models/country";
import { IState } from "../../models/state";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class createStateController {
  stateService;
  countryServices;
  constructor(stateService: StateService, countryServices: CountryServices) {
    this.stateService = stateService;
    this.countryServices = countryServices;
    const createStateButton = <HTMLButtonElement>(
      document.getElementById("create-state-button")
    );
    createStateButton.addEventListener("click", this.onClickCreateStateButton);

    configureValidator("statename");
    configureValidator("country");
  }

  onClickCreateStateButton = () => {
    if (this.validateCreateStateForm() === true) {
      this.sendData();
    }
  };
  validateCreateStateForm() {
    let isFormValid = true;

    if (validateFieldRequired("statename") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("country") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  sendData = async () => {
    try {
      const stateNameInput = <HTMLInputElement>(
        document.querySelector("[name='statename']")
      );
      const countryInput = <HTMLInputElement>(
        document.querySelector("[name='country']")
      );

      const state: IState = {
        id: "",
        name: stateNameInput.value,
        countryId: countryInput.value,
      };

      await this.stateService.createState(state);
      alert("Los datos fueron guardados");
      window.location.href = "/states";
    } catch (error) {
      errorHandler("No se pudo craer su stado", error);
    }
  };

  async init() {
    try {
      const countryData = await this.countryServices.getCountries();
      this.renderCountries(countryData);
    } catch (error) {
      errorHandler("error al sincronizar datos", error);
    }
  }

  renderStates(statesDataList: IState[]) {
    const statesSelect = <HTMLSelectElement>document.getElementById("states");

    const statesOptionTemplate = <HTMLTemplateElement>(
      document.getElementById("states-option-template")
    );

    for (let i = 0; i < statesDataList.length; i++) {
      const copyStatesOptionTemplate = document.importNode(
        statesOptionTemplate.content,
        true
      );
    }
  }

  renderCountries(countryDataList: ICountry[]) {
    const countrySelect = <HTMLSelectElement>document.getElementById("country");

    const countryTemplate = <HTMLTemplateElement>(
      document.getElementById("state-create-template")
    );

    for (let i = 0; i < countryDataList.length; i++) {
      const copyCountryTemplate = document.importNode(
        countryTemplate.content,
        true
      );

      const newStateOption = copyCountryTemplate.querySelector("option");
      if (newStateOption !== null) {
        newStateOption.textContent = `${countryDataList[i].name}`;
        newStateOption.setAttribute("value", `${countryDataList[i].id}`);
        countrySelect.append(newStateOption);
      }
    }
  }
}

const createStateCtrl = new createStateController(
  new StateService(),
  new CountryServices()
);
createStateCtrl.init();
