// Import all of Bootstrap's JS
import { Modal, Toast } from "bootstrap";
import { IAuthor } from "../../models/author";
import { AuthorsService } from "../../services/authors-service";
import { errorHandler } from "../../utils/error-handler";

class ListAuthorsController {
  constructor(private authorsService: AuthorsService) {
    const createButton = document.getElementById("create-button");
    createButton?.addEventListener("click", this.onClickCreateButton);
  }

  public async init() {
    try {
      const authorsDataList = await this.authorsService.getAuthors();
      this.removeWaitingMessageRow();

      if (authorsDataList.length === 0) {
        const elementNoAuthorsAvailableMessage = document.querySelector(
          "#no-authors-available"
        );
        elementNoAuthorsAvailableMessage?.setAttribute("class", "");
      }

      this.renderAuthors(authorsDataList);
    } catch (error) {
      errorHandler(
        "No se pudieron cargar los datos de los autores, intentente mas tarde",
        error
      );
    }
  }
  private removeWaitingMessageRow() {
    const waitingMessageRow = document.getElementById("waiting-message-row");
    waitingMessageRow?.remove();
  }

  private renderAuthors(authorsList: IAuthor[]) {
    const authorTableBodyElement = <HTMLTableElement>(
      document.querySelector("#author-table tbody")
    );
    const authorRowTemplate = <HTMLTemplateElement>(
      document.getElementById("author-row-template")
    );

    for (let i = 0; i < authorsList.length; i++) {
      const copyRowTemplate = document.importNode(
        authorRowTemplate?.content,
        true
      );

      const authorNameTd =
        copyRowTemplate.querySelector<HTMLTableColElement>("[name='name']");
      if (authorNameTd !== null) {
        authorNameTd.textContent = authorsList[i].name;
      }

      const authorBirthateTd =
        copyRowTemplate.querySelector<HTMLTableColElement>(
          "[name='birthdate']"
        );
      const birthdate = new Date(authorsList[i].birthdate);
      if (authorBirthateTd !== null) {
        authorBirthateTd.textContent = birthdate.toLocaleString();
      }

      const editAuthorButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-author-button']")
      );

      editAuthorButton.setAttribute("data-id", authorsList[i].id);
      editAuthorButton.addEventListener("click", this.onClickEditButton);
      editAuthorButton.classList.add("btn");
      editAuthorButton.classList.add("btn-secondary");

      const deleteAuthorButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-author-button']")
      );
      deleteAuthorButton.setAttribute("data-id", authorsList[i].id);
      deleteAuthorButton.setAttribute("data-name", authorsList[i].name);
      deleteAuthorButton.addEventListener("click", this.onClickDeleteButton);
      deleteAuthorButton.classList.add("btn");
      deleteAuthorButton.classList.add("btn-secondary");

      authorTableBodyElement.append(copyRowTemplate);
    }
  }

  private onClickCreateButton() {
    window.location.href = "/authors/create";
  }

  private onClickEditButton = (event: Event) => {
    const id = (<HTMLButtonElement>event.target).getAttribute("data-id");
    window.location.href = `http://localhost:8080/authors/edit/?id=${id}`;
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
      modalBodyElement.textContent = `Quiere eliminar el autor: ${dataName} ?`;

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
            await this.authorsService.deleteAuthor(idToDelete);
          }
        } catch (error) {
          errorHandler("No se pudo eliminar el autor", error);
        } finally {
          if (toastModalElement !== null) {
            toast.show();
          }
          setTimeout(() => {
            window.location.href = "http://localhost:8080/authors/";
          }, 1000);
        }
      });

      myDeleteModal.show();
    }
  };
}

const listAuthorsCtrl = new ListAuthorsController(new AuthorsService());
listAuthorsCtrl.init();
