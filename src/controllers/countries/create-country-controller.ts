// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import { ICountry } from "../../models/country";
import { CountryServices } from "../../services/country-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class CreateCountryController {
  constructor(private countryServices: CountryServices) {
    const createCountryButton = document.getElementById(
      "create-country-button"
    );
    createCountryButton?.addEventListener(
      "click",
      this.onClickCreateCountryButton
    );
    configureValidator("countryname");
  }

  private validateCreateCountryForm() {
    let isFormValid = true;

    if (validateFieldRequired("countryname") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  private onClickCreateCountryButton = (event: Event) => {
    event.preventDefault();
    if (this.validateCreateCountryForm() === true) {
      this.sendCountryData();
    }
  };

  private sendCountryData = async () => {
    const countryNameInputElement = <HTMLInputElement>(
      document.querySelector("[name='countryname']")
    );
    const country: ICountry = {
      id: "",
      name: countryNameInputElement.value,
    };

    try {
      await this.countryServices.createCountry(country);
      alert("Country created");
      window.location.href = "/countries";
    } catch (error) {
      errorHandler(
        "Your country couldn't be created, please try later.",
        error
      );
    } finally {
      this.removeActivityIndicationMessage();
    }
  };

  private removeActivityIndicationMessage() {
    const waitingIndicationMessage = document.getElementById(
      "Activity-indication-message"
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }
  }
}
const createCountryCtrl = new CreateCountryController(new CountryServices());
