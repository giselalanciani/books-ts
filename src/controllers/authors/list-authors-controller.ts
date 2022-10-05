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
    const authorTable = document.getElementById("author-table");
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

      const editAuthorButton = copyRowTemplate.querySelector<HTMLButtonElement>(
        "[name='edit-author-button']"
      );

      editAuthorButton?.setAttribute("data-id", authorsList[i].id);
      editAuthorButton?.addEventListener("click", this.onClickEditButton);

      const deleteAuthorButton =
        copyRowTemplate.querySelector<HTMLButtonElement>(
          "[name='delete-author-button']"
        );
      deleteAuthorButton?.setAttribute("data-id", authorsList[i].id);
      deleteAuthorButton?.addEventListener("click", this.onClickDeleteButton);

      authorTable?.append(copyRowTemplate);
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
    const id = (<HTMLButtonElement>event.target).getAttribute("data-id");
    try {
      if (id !== null) {
        await this.authorsService.deleteAuthor(id);
      }
      alert("Autor eliminado");
      window.location.href = "/authors";
    } catch (error) {
      errorHandler("No se pudo eliminar el autor, intente mas tarde.", error);
    }
  };
}

const listAuthorsCtrl = new ListAuthorsController(new AuthorsService());
listAuthorsCtrl.init();
