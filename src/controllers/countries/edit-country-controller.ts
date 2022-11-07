// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import { ICountry } from "../../models/country";
import { CountryServices } from "../../services/country-service";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditCountryController {
  constructor(private countryServices: CountryServices) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-country-button")
    );
    saveButton?.addEventListener("click", this.onClickSaveButton);
  }

  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }
  private validateEditCountryForm() {
    let isFormValid = true;

    if (validateFieldRequired("countryname") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }
  private onClickSaveButton = async (event: Event) => {
    if (this.validateEditCountryForm()) {
      try {
        const countryNameInputElement = <HTMLInputElement>(
          document.querySelector("[name='countryname']")
        );

        const id = this.getQueryParams().id;
        const country = {
          id: id,
          name: countryNameInputElement.value,
        };

        await this.countryServices.updateCountry(country);
        alert("Los datos fueron guardados");
        window.location.href = "/countries";
      } catch (error) {
        errorHandler(
          "El país no puede ser guardado en este momento, por favor intente nuevamente",
          error
        );
      }
    }
  };
  
  public async init() {
    const params = this.getQueryParams();
    const id = params.id;
    try {
      const countryData = await this.countryServices.getCountry(params.id);      

      const countryInputElement = <HTMLInputElement>(
        document.querySelector("[name='countryname']")
      );
      countryInputElement.value = countryData.name;
    } catch (error) {
      errorHandler("Error en la busqueda,vualva a intentarlo luego", error);
    } finally {
      this.removeActivityIndicationMessage();
    }
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

const editCountryCtrl = new EditCountryController(new CountryServices());
editCountryCtrl.init();
