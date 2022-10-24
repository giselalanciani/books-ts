import { IEditorial } from "../../models/editorial";
import { EditorialService } from "../../services/editorial-service";
import { errorHandler } from "../../utils/error-handler";

class ListEditorialController {
  constructor(private editorialService: EditorialService) {
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);
  }
  public async init() {
    try {
      const editorialsDataList = await this.editorialService.getEditorials();
      this.removeWaitingMessageRow();
      if (editorialsDataList.length === 0) {
        const elementNoEditorialsAvailableMessage = <HTMLSelectElement>(
          document.querySelector("#no-editorials-available")
        );
        elementNoEditorialsAvailableMessage.setAttribute("class", "");
      }
      const responseEditorialsData =
        await this.editorialService.getEditorials();
      this.renderEditorials(responseEditorialsData);
    } catch (error) {
      errorHandler("No podemos encontrar los datos, intente nuevamente", error);
    }
  }
  private removeWaitingMessageRow() {
    const waitingMessageRow = <HTMLDivElement>(
      document.getElementById("waiting-message-row")
    );
    waitingMessageRow.remove();
  }
  private renderEditorials(editorialsList: IEditorial[]) {
    const editorialTableElement = <HTMLTableElement>(
      document.getElementById("editorial-table")
    );
    const editorialRowTemplateElement = <HTMLTemplateElement>(
      document.getElementById("editorial-row-template")
    );

    for (let i = 0; i < editorialsList.length; i++) {
      const copyRowTemplate = document.importNode(
        editorialRowTemplateElement.content,
        true
      );

      const nameTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameTdElement.textContent = editorialsList[i].name;

      const editEditorialButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-editorial-button']")
      );
      editEditorialButton.setAttribute("data-id", editorialsList[i].id);
      editEditorialButton.addEventListener("click", this.onClickEditButton);

      const deleteEditorialButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-editorial-button']")
      );

      deleteEditorialButton.setAttribute("data-id", editorialsList[i].id);
      deleteEditorialButton.addEventListener("click", this.onClickDeleteButton);

      editorialTableElement.append(copyRowTemplate);
    }
  }

  private onClickCreateButton() {
    window.location.href = "/editorials/create";
  }

  private onClickEditButton = (event: Event) => {
    const editButton = <HTMLButtonElement>event.target;
    const dataId = editButton.getAttribute("data-id");

    window.location.href = `http://localhost:8080/editorials/edit/?id=${dataId}`;
  };

  private onClickDeleteButton = async (event: Event) => {
    const id = (<HTMLButtonElement>event.target).getAttribute("data-id");

    try {
      if (id !== null) {
        await this.editorialService.deleteEditorial(id);
      }

      alert("Editorial eliminada");
      window.location.href = "/editorials";
    } catch (error) {
      errorHandler(
        "No se pudo eliminar su editorial, intente mas tarde.",
        error
      );
    }
  };
}

const listEditorialCtrl = new ListEditorialController(new EditorialService());
listEditorialCtrl.init();
