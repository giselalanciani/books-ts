import { EditorialService } from "../../services/editorial-service";
import { BookService } from "../../services/book-service";
import { errorHandler } from "../../utils/error-handler";
import { Ibook } from "../../models/book";
import { IEditorial } from "../../models/editorial";

/**
 * Que debe hacer:
 *  1) Cuando la pagina inicia.
 *    1.a) Debe pedir los datos a la API.
 *    1.b) Debemos renderizar los datos dentro de la tabla. (cada item del array es un tr en la tabla)
 *        1.b.1) TIP: debemos loopear los datos, crear un template de tr,
 *              - en cada iteracion hacer una copia de ese template.
 *              - hacer los reemplazos de los datos en cada columna de ese tr
 *              - hacer un append, dentro de la tabla
 *
 *  2) cuando apreta el boton de crear:
 *    2.a) redirecciona a la pagina de crear Libro
 *
 *  3) Cunado apreta el botn de editar:
 *    3.a ) redirecciona a la pantalla de editar libro
 *
 *  4) Cuando apreta en boton eliminar
 *    4.a) Pregunta al usuario confirmacion
 *    4.b ) Si elije OK -> eleminia el Book
 *      4.b.1) luego refresca la pantalla para mostrar los datos actualizado
 *
 */

class ListBooksController {
  constructor(
    private editorialService: EditorialService,
    private bookService: BookService
  ) {
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);
  }

  private onClickCreateButton = () => {
    window.location.href = "/books/create";
  };

  private onClickDeleteButton = async (event: Event) => {
    const deleteButton = <HTMLButtonElement>event.target;
    const dataName = deleteButton.getAttribute("data-name");

    if (confirm(`Quiere eliminar su libro: ${dataName} ?`) == true)
      try {
        const idToDelete = deleteButton.getAttribute("data-id");
        if (idToDelete !== null) {
          await this.bookService.deleteBook(idToDelete);
        }

        window.location.href = "http://localhost:8080/books/";
      } catch (error) {
        errorHandler("No se pudo eliminar su libro", error);
      }
  };

  private onClickEditButton = async (event: Event) => {
    const editButtonElement = <HTMLButtonElement>event.target;
    const dataId = editButtonElement.getAttribute("data-id");

    window.location.href = `http://localhost:8080/books/edit/?id=${dataId}`;
  };

  public async init() {
    try {
      const booksDataList = await this.bookService.getBooks();
      if (booksDataList.length === 0) {
        const elementNoBooksAvailableMessage = document.querySelector(
          "#no-books-available"
        );
        if (elementNoBooksAvailableMessage !== null) {
          elementNoBooksAvailableMessage.setAttribute("class", "");
        }
      }

      const editorialsDataList = await this.editorialService.getEditorials();

      this.renderBooks(booksDataList, editorialsDataList);
      this.removeWaitingMessageRow();
    } catch (error) {
      errorHandler("No podemos encontrar los datos, intente nuevamente", error);
    }
  }

  private removeWaitingMessageRow() {
    const waitingMessageRow = document.getElementById("waiting-message-row");
    if (waitingMessageRow !== null) {
      waitingMessageRow.remove();
    }
  }

  private renderBooks(booksData: Ibook[], editorialsData: IEditorial[]) {
    const bookTable = <HTMLTableElement>document.getElementById("books-table");
    const bookRowTemplate = <HTMLTemplateElement>(
      document.getElementById("book-row-template")
    );

    for (let i = 0; i < booksData.length; i++) {
      const copyRowTemplate = document.importNode(
        bookRowTemplate.content,
        true
      );
      const nameInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameInput.textContent = booksData[i].name;

      const yearInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='year']")
      );
      yearInput.textContent = booksData[i].year;

      const authorInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='author']")
      );
      authorInput.textContent = booksData[i].author;

      const stockInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='stock']")
      );
      stockInput.textContent = booksData[i].stock;

      const priceInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='price']")
      );
      priceInput.textContent = booksData[i].price;

      const editorialInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='editorial']")
      );

      const editorialName = this.findEditorialNameById(
        booksData[i].editorial,
        editorialsData
      );
      editorialInput.textContent = editorialName;

      const editBookButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-book-button']")
      );
      editBookButton.setAttribute("data-id", booksData[i].id);
      editBookButton.addEventListener("click", this.onClickEditButton);

      const deleteBookButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-book-button']")
      );
      deleteBookButton.setAttribute("data-id", booksData[i].id);
      deleteBookButton.setAttribute("data-name", booksData[i].name);
      deleteBookButton.addEventListener("click", this.onClickDeleteButton);

      bookTable.append(copyRowTemplate);
    }
  }

  private findEditorialNameById(id: string, editorialsList: IEditorial[]) {
    let editorialNameFound = "Editorial no encontrada";

    for (let i = 0; i < editorialsList.length; i++) {
      if (id == editorialsList[i].id) {
        editorialNameFound = editorialsList[i].name;
        break;
      }
    }

    return editorialNameFound;
  }
}
const booksCtrl = new ListBooksController(
  new EditorialService(),
  new BookService()
);
booksCtrl.init();
