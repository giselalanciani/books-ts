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
      const editorialInput = <HTMLInputElement>(
        document.querySelector("[name='editorialname']")
      );

      const editorial: IEditorial = {
        id: "",
        name: editorialInput.value,
      };

      const id = this.getQueryParams().id;

      try {
        const updateEditorialResponseData =
          await this.editorialService.updateEditorial(id, editorial);
        alert("Su libro fue guardado correctamente");
        window.location.href = "/editorials";
      } catch (error) {
        errorHandler("No se pudo guardar su libro", error);
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

  private renderEditorial(editorialDataList: IEditorial[]) {
    const editorialSelect = <HTMLSelectElement>(
      document.getElementById("editorialname")
    );

    const editorialTemplate = <HTMLTemplateElement>(
      document.getElementById("editorial-template")
    );

    for (let i = 0; i < editorialDataList.length; i++) {
      const copyEditorialTemplate = document.importNode(
        editorialTemplate.content,
        true
      );
    }
  }

  public async init() {
    const params = this.getQueryParams();
    try {
      const editorialData = await this.editorialService.getEditorial(params.id);
      this.renderEditorial(editorialData);

      const editorialInput = <HTMLInputElement>(
        document.querySelector("[name='editorialname']")
      );
      editorialInput.value = editorialData.name;
    } catch (error) {
      errorHandler("Error en la busqueda,vualva a intentarlo luego", error);
    }
  }
}
const editEditorialCtrl = new EditEditorialController(new EditorialService());
editEditorialCtrl.init();
