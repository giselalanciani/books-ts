import { ICountry } from "../../models/country";
import { CountryServices } from "../../services/country-service";
import { errorHandler } from "../../utils/error-handler";

class CreateCountryController {
  constructor(private countryServices: CountryServices) {
    const createCountryButton = document.getElementById(
      "create-country-button"
    );
    createCountryButton?.addEventListener(
      "click",
      this.onClickCreateCountryButton
    );
  }

  private validateCreateForm() {
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

  private onClickCreateCountryButton = () => {
    if (this.validateCreateForm() === true) {
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
