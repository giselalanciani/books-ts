import { ICountry } from "../../models/country";
import { CountryServices } from "../../services/country-service";
import { errorHandler } from "../../utils/error-handler";

class CreateCountryController {
  countryServices;
  constructor(countryServices: CountryServices) {
    this.countryServices = countryServices;
    const createCountryButton = document.getElementById(
      "create-country-button"
    );
    createCountryButton?.addEventListener(
      "click",
      this.onClickCreateCountryButton
    );
  }

  validateCreateForm() {
    const countryNameInput = <HTMLInputElement>(
      document.querySelector("[name='countryname']")
    );
    const nameRequiredError = <HTMLSelectElement>(
      document.querySelector("[name='countryname-required']")
    );
    if (countryNameInput.value == "") {
      nameRequiredError.classList.remove("hidden");
      return false;
    }
    nameRequiredError.classList.add("hidden");
    return true;
  }

  onClickCreateCountryButton = () => {
    if (this.validateCreateForm() === true) {
      this.sendCountryData();
    }
  };

  sendCountryData = async () => {
    const countryNameInput = <HTMLInputElement>(
      document.querySelector("[name='countryname']")
    );
    const country: ICountry = {
      id: "",
      name: countryNameInput.value,
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

  removeActivityIndicationMessage() {
    const waitingIndicationMessage = document.getElementById(
      "Activity-indication-message"
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }
  }
}
const createCountryCtrl = new CreateCountryController(new CountryServices());
