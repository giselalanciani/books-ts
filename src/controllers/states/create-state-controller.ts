import { Toast } from "bootstrap";
import { ICountry } from "../../models/country";
import { IState } from "../../models/state";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class createStateController {
  constructor(
    private stateService: StateService,
    private countryServices: CountryServices
  ) {
    const createStateButton = <HTMLButtonElement>(
      document.getElementById("create-state-button")
    );
    createStateButton.addEventListener("click", this.onClickCreateStateButton);

    configureValidator("statename");
    configureValidator("country");
  }

  private onClickCreateStateButton = (event: Event) => {
    event.preventDefault();
    if (this.validateCreateStateForm() === true) {
      this.sendData();
    }
  };
  private validateCreateStateForm() {
    let isFormValid = true;

    if (validateFieldRequired("statename") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("country") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  private sendData = async () => {
    const toastModalElement = <HTMLDivElement>(
      document.querySelector("#delete-toast")
    );
    const toast = new Toast(toastModalElement);
    try {
      const stateNameInputElement = <HTMLInputElement>(
        document.querySelector("[name='statename']")
      );
      const countryInputElement = <HTMLInputElement>(
        document.querySelector("[name='country']")
      );

      const state: IState = {
        id: "",
        name: stateNameInputElement.value,
        countryId: countryInputElement.value,
      };

      await this.stateService.createState(state);
    } catch (error) {
      errorHandler("No se pudo craer su stado", error);
    } finally {
      if (toastModalElement !== null) {
        toast.show();
      }
      setTimeout(() => {
        window.location.href = "http://localhost:8080/states/";
      }, 1000);
    }
  };

  public async init() {
    try {
      const countryData = await this.countryServices.getCountries();
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
      document.getElementById("state-create-template")
    );

    for (let i = 0; i < countryDataList.length; i++) {
      const copyCountryTemplate = document.importNode(
        countryTemplateElement.content,
        true
      );

      const newStateOption = copyCountryTemplate.querySelector("option");
      if (newStateOption !== null) {
        newStateOption.textContent = `${countryDataList[i].name}`;
        newStateOption.setAttribute("value", `${countryDataList[i].id}`);
        countrySelectElement.append(newStateOption);
      }
    }
  }
}

const createStateCtrl = new createStateController(
  new StateService(),
  new CountryServices()
);
createStateCtrl.init();
