import { IState } from "../../models/state";
import { StateService } from "../../services/states-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditStateController {
  stateService;
  constructor(stateService: StateService) {
    this.stateService = stateService;
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-state-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("statename");
  }

  getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }
  onClickSaveButton = async (event: Event) => {
    if (this.validateEditStateForm()) {
      try {
        const stateNameInput = <HTMLInputElement>(
          document.querySelector("[name='statename']")
        );

        const id = this.getQueryParams().id;
        const countryId = this.getQueryParams().countryId;

        const state: IState = {
          id: id,
          name: stateNameInput.value,
          countryId: countryId,
        };

        await this.stateService.updateState(id, state);
        alert("Los datos fueron guardados");
        window.location.href = "/states";
      } catch (error) {
        errorHandler(
          "El estado no puede ser guardado en este momento, por favor intente nuevamente",
          error
        );
      }
    }
  };
  validateEditStateForm() {
    let isFormValid = true;

    if (validateFieldRequired("statename") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  async init() {
    const params = this.getQueryParams();

    try {
      const stateData = await this.stateService.getState(
        params.countryId,
        params.id
      );
      const indicatorMessage = <HTMLParagraphElement>(
        document.querySelector("[id='Activity-indication-message']")
      );
      indicatorMessage.classList.add('hidden');
      
      const stateInput = <HTMLInputElement>(
        document.querySelector("[name='statename']")
      );
      stateInput.value = stateData.name;
    } catch (error) {
      errorHandler("error al encontrar la data", error);
    }
  }
}
const editStateCtrl = new EditStateController(new StateService());
editStateCtrl.init();