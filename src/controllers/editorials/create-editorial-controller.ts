import { Toast } from "bootstrap";
import { IEditorial } from "../../models/editorial";
import { EditorialService } from "../../services/editorial-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class CreateEditorialController {
  constructor(private editorialService: EditorialService) {
    const createEditorialButton = <HTMLButtonElement>(
      document.getElementById("create-editorial-button")
    );
    createEditorialButton.addEventListener(
      "click",
      this.onClickCreateEditorialButton
    );

    configureValidator("editorialname");
  }
  private onClickCreateEditorialButton = async (event: Event) => {
    event.preventDefault();
    if (this.validateCreateEditorialForm() === true) {
      await this.sendEditorialData();
    }
  };

  private validateCreateEditorialForm() {
    let isFormValid = true;

    if (validateFieldRequired("editorialname") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  private sendEditorialData = async () => {
    const editorialNameInputElement = <HTMLInputElement>(
      document.querySelector("[name='editorialname']")
    );

    const editorial: IEditorial = {
      id: "",
      name: editorialNameInputElement.value,
    };
    const toastModalElement = <HTMLDivElement>(
      document.querySelector("#delete-toast")
    );
    const toast = new Toast(toastModalElement);
    try {
      await this.editorialService.createEditorial(editorial);
    } catch (error) {
      errorHandler("No se pudo crear su editorial, intente mas tarde.", error);
    } finally {
      if (toastModalElement !== null) {
        toast.show();
      }
      setTimeout(() => {
        window.location.href = "http://localhost:8080/editorials/";
      }, 1000);
    }
  };
}

const createEditorialCtrl = new CreateEditorialController(
  new EditorialService()
);
