// Import all of Bootstrap's JS
import { Modal, Toast } from "bootstrap";
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
    const editorialTableBodyElement = <HTMLTableElement>(
      document.querySelector("#editorial-table tbody")
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
      editEditorialButton.classList.add("btn");
      editEditorialButton.classList.add("btn-secondary");

      const deleteEditorialButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-editorial-button']")
      );

      deleteEditorialButton.setAttribute("data-id", editorialsList[i].id);
      deleteEditorialButton.setAttribute("data-name", editorialsList[i].name);
      deleteEditorialButton.addEventListener("click", this.onClickDeleteButton);
      deleteEditorialButton.classList.add("btn");
      deleteEditorialButton.classList.add("btn-secondary");

      editorialTableBodyElement.append(copyRowTemplate);
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
    const deleteButton = <HTMLButtonElement>event.target;

    const dataName = deleteButton.getAttribute("data-name");

    const myModalDeleteElement = <HTMLDivElement>(
      document.getElementById("delete-modal")
    );

    if (myModalDeleteElement !== null) {
      const myDeleteModal = new Modal(myModalDeleteElement);

      const modalBodyElement = <HTMLDivElement>(
        myModalDeleteElement.querySelector("div.modal-body")
      );
      modalBodyElement.textContent = `Quiere eliminar la editorial: ${dataName} ?`;

      const modalButtonYesElement = <HTMLButtonElement>(
        myModalDeleteElement.querySelector("#button-yes")
      );
      const toastModalElement = <HTMLDivElement>(
        document.querySelector("#delete-toast")
      );
      const toast = new Toast(toastModalElement);
      modalButtonYesElement.addEventListener("click", async () => {
        myDeleteModal.hide();
        try {
          const idToDelete = deleteButton.getAttribute("data-id");
          if (idToDelete !== null) {
            await this.editorialService.deleteEditorial(idToDelete);
          }
        } catch (error) {
          errorHandler("No se pudo eliminar la editorial", error);
        } finally {
          if (toastModalElement !== null) {
            toast.show();
          }
          setTimeout(() => {
            window.location.href = "http://localhost:8080/editorials/";
          }, 1000);
        }
      });

      myDeleteModal.show();
    }
  };
}

const listEditorialCtrl = new ListEditorialController(new EditorialService());
listEditorialCtrl.init();
