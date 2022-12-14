import { Toast } from "bootstrap";
import { IEditorial } from "../../models/editorial";
import { EditorialService } from "../../services/editorial-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditEditorialController {
  constructor(private editorialService: EditorialService) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-editorial-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("editorialname");
  }

  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }

  private onClickSaveButton = async (event: Event) => {
    if (this.validateEditEditorialForm() === true) {
      const editorialInputElement = <HTMLInputElement>(
        document.querySelector("[name='editorialname']")
      );

      const editorial: IEditorial = {
        id: "",
        name: editorialInputElement.value,
      };

      const id = this.getQueryParams().id;
      const toastModalElement = <HTMLDivElement>(
        document.querySelector("#edit-toast")
      );
      const toast = new Toast(toastModalElement);

      try {
        const updateEditorialResponseData =
          await this.editorialService.updateEditorial(id, editorial);
      } catch (error) {
        errorHandler("No se pudo guardar su libro", error);
      } finally {
        if (toastModalElement !== null) {
          toast.show();
        }
        setTimeout(() => {
          window.location.href = "http://localhost:8080/editorials/";
        }, 1000);
      }
    }
  };

  private validateEditEditorialForm() {
    let isFormValid = true;

    if (validateFieldRequired("editorialname") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  public async init() {
    const params = this.getQueryParams();
    try {
      const editorialData = await this.editorialService.getEditorial(params.id);

      const editorialInputElement = <HTMLInputElement>(
        document.querySelector("[name='editorialname']")
      );
      editorialInputElement.value = editorialData.name;
    } catch (error) {
      errorHandler("Error en la busqueda,vualva a intentarlo luego", error);
    }
  }
}
const editEditorialCtrl = new EditEditorialController(new EditorialService());
editEditorialCtrl.init();
