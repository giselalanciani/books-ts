// Import all of Bootstrap's JS
import { Modal } from "bootstrap";
import { EditorialService } from "../../services/editorial-service";
import { BookService } from "../../services/book-service";
import { errorHandler } from "../../utils/error-handler";
import { Ibook } from "../../models/book";
import { IEditorial } from "../../models/editorial";
import { CategoriesServices } from "../../services/categories-service";

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
    private bookService: BookService,
    private categorieService: CategoriesServices
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

    const myModalDeleteElement = <HTMLDivElement>(
      document.getElementById("delete-modal")
    );

    if (myModalDeleteElement !== null) {
      const myDeleteModal = new Modal(myModalDeleteElement);

      const modalBodyElement = <HTMLDivElement>(
        myModalDeleteElement.querySelector("div.modal-body")
      );
      modalBodyElement.textContent = `Quiere eliminar su libro: ${dataName} ?`;

      const modalButtonYesElement = <HTMLButtonElement>(
        myModalDeleteElement.querySelector("#button-yes")
      );
      modalButtonYesElement.addEventListener("click", async () => {
        try {
          const idToDelete = deleteButton.getAttribute("data-id");
          if (idToDelete !== null) {
            await this.bookService.deleteBook(idToDelete);
          }
          window.location.href = "http://localhost:8080/books/";
        } catch (error) {
          errorHandler("No se pudo eliminar su libro", error);
        }
      });

      myDeleteModal.show();
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

  private async renderBooks(booksData: Ibook[], editorialsData: IEditorial[]) {
    const bookTableBodyElement = <HTMLTableElement>(
      document.querySelector("#books-table tbody")
    );
    const bookRowTemplate = <HTMLTemplateElement>(
      document.getElementById("book-row-template")
    );

    for (let i = 0; i < booksData.length; i++) {
      const copyRowTemplate = document.importNode(
        bookRowTemplate.content,
        true
      );
      const nameTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameTdElement.textContent = booksData[i].name;

      const yearTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='year']")
      );
      yearTdElement.textContent = booksData[i].year;

      const authorTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='author']")
      );
      authorTdElement.textContent = booksData[i].author;

      const stockTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='stock']")
      );
      stockTdElement.textContent = booksData[i].stock;

      const priceTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='price']")
      );
      priceTdElement.textContent = booksData[i].price;

      const editorialTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='editorial']")
      );

      const editorialName = this.findEditorialNameById(
        booksData[i].editorial,
        editorialsData
      );
      editorialTdElement.textContent = editorialName;

      const categoryTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='categories']")
      );

      // categoryTdElement.textContent = booksData[i].categories.join(', ');
      categoryTdElement.textContent = await this.getRenderCategories(
        booksData[i].categories
      );

      const editBookButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-book-button']")
      );
      editBookButton.setAttribute("data-id", booksData[i].id);
      editBookButton.addEventListener("click", this.onClickEditButton);
      editBookButton.classList.add("btn");
      editBookButton.classList.add("btn-secondary");

      const deleteBookButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-book-button']")
      );
      deleteBookButton.setAttribute("data-id", booksData[i].id);
      deleteBookButton.setAttribute("data-name", booksData[i].name);
      deleteBookButton.addEventListener("click", this.onClickDeleteButton);
      deleteBookButton.classList.add("btn");
      deleteBookButton.classList.add("btn-secondary");

      bookTableBodyElement.append(copyRowTemplate);
    }
  }

  private async getRenderCategories(categories: string[]): Promise<string> {
    let likedCategories = "";
    for (let j = 0; j < categories.length; j++) {
      const categoryModel = await this.categorieService.getCategory(
        categories[j]
      );
      if (j === 0) {
        likedCategories = likedCategories + categoryModel.name;
      } else {
        likedCategories = likedCategories + ", " + categoryModel.name;
      }
    }

    return likedCategories;
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
  new BookService(),
  new CategoriesServices()
);
booksCtrl.init();
