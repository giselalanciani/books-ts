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
  private onClickCreateEditorialButton = async () => {
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

    try {
      await this.editorialService.createEditorial(editorial);
      alert("Editorial creada");
      window.location.href = "/editorials";
    } catch (error) {
      errorHandler("No se pudo crear su editorial, intente mas tarde.", error);
    }
  };
}

const createEditorialCtrl = new CreateEditorialController(
  new EditorialService()
);
