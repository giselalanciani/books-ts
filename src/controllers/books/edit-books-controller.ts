import { IAuthor } from "../../models/author";
import { Ibook } from "../../models/book";
import { IEditorial } from "../../models/editorial";
import { AuthorsService } from "../../services/authors-service";
import { BookService } from "../../services/book-service";
import { EditorialService } from "../../services/editorial-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldNumeric } from "../../utils/validateFieldNumeric";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditBooksController {
  constructor(
    private editorialService: EditorialService,
    private authorsService: AuthorsService,
    private bookService: BookService
  ) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-book-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("bookname");
    configureValidator("year", ["required", "numeric"]);
    configureValidator("editorial");
    configureValidator("authors");
    configureValidator("stock", ["required", "numeric"]);
    configureValidator("price", ["required", "numeric"]);
  }

  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }

  private onClickSaveButton = async (event: Event) => {
    if (this.validateEditBookForm()) {
      try {
        const bookNameInput = <HTMLInputElement>(
          document.querySelector("[name='bookname']")
        );
        const bookYearInput = <HTMLInputElement>(
          document.querySelector("[name='year']")
        );
        const stockInput = <HTMLInputElement>(
          document.querySelector("[name='stock']")
        );
        const priceInput = <HTMLInputElement>(
          document.querySelector("[name='price']")
        );
        const authorsSelectorInput = <HTMLSelectElement>(
          document.querySelector("[name='authors']")
        );
        const editorialSelectorInput = <HTMLSelectElement>(
          document.querySelector("[name='editorial']")
        );

        const book: Ibook = {
          id: "",
          name: bookNameInput.value,
          year: bookYearInput.value,
          author: authorsSelectorInput.value,
          editorial: editorialSelectorInput.value,
          stock: stockInput.value,
          price: priceInput.value,
        };

        const id = this.getQueryParams().id;

        await this.bookService.updateBook(id, book);
        alert("Los datos fueron guardados");
        window.location.href = "/books";
      } catch (error) {
        errorHandler(
          "Su libro no pudo ser guardado correctamente, por favor intente nuevamente",
          error
        );
      }
    }
  };

  private validateEditBookForm() {
    let isFormValid = true;

    if (validateFieldRequired("bookname") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("year") === false) {
      isFormValid = false;
    }

    if (validateFieldNumeric("year") === false) {
      isFormValid = false;
    }

    if (validateFieldRequired("editorial") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("authors") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("stock") === false) {
      isFormValid = false;
    }

    if (validateFieldNumeric("stock") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("price") === false) {
      isFormValid = false;
    }

    if (validateFieldNumeric("price") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  private renderAuthors(authorsDataList: IAuthor[]) {
    const authorsSelect = <HTMLSelectElement>document.getElementById("authors");

    const authorOptionTemplate = <HTMLTemplateElement>(
      document.getElementById("author-option-template")
    );

    for (let i = 0; i < authorsDataList.length; i++) {
      const copyAuthorOptionTemplate = document.importNode(
        authorOptionTemplate.content,
        true
      );

      const newAuthorOption = <HTMLOptionElement>(
        copyAuthorOptionTemplate.querySelector("option")
      );

      newAuthorOption.textContent = `${authorsDataList[i].name}`;
      newAuthorOption.setAttribute("value", `${authorsDataList[i].name}`);

      authorsSelect.append(newAuthorOption);
    }
  }

  private renderEditorials(editorialDataList: IEditorial[]) {
    const editorialSelect = <HTMLSelectElement>(
      document.getElementById("editorial")
    );

    const editorialTemplate = <HTMLTemplateElement>(
      document.getElementById("editorial-template")
    );

    for (let i = 0; i < editorialDataList.length; i++) {
      const copyEditorialTemplate = document.importNode(
        editorialTemplate.content,
        true
      );

      const newEditorialOption = <HTMLOptionElement>(
        copyEditorialTemplate.querySelector("option")
      );

      newEditorialOption.textContent = `${editorialDataList[i].name}`;
      newEditorialOption.setAttribute("value", `${editorialDataList[i].id}`);

      editorialSelect.append(newEditorialOption);
    }
  }

  public async init() {
    const params = this.getQueryParams();

    try {
      const bookData = await this.bookService.getBook(params.id);
      const authorsData = await this.authorsService.getAuthors();
      const editoriasData = await this.editorialService.getEditorials();

      this.renderAuthors(authorsData);
      this.renderEditorials(editoriasData);

      const bookInput = <HTMLInputElement>(
        document.querySelector("[name='bookname']")
      );
      bookInput.value = bookData.name;
      const yearInput = <HTMLInputElement>(
        document.querySelector("[name='year']")
      );
      yearInput.value = bookData.year;
      const stockInput = <HTMLInputElement>(
        document.querySelector("[name='stock']")
      );
      stockInput.value = bookData.stock;
      const authorsSelect = <HTMLSelectElement>(
        document.querySelector("[name='authors']")
      );
      authorsSelect.value = bookData.author;
      const editorialSelect = <HTMLSelectElement>(
        document.querySelector("[name='editorial']")
      );
      editorialSelect.value = bookData.editorial;
    } catch (error) {
      errorHandler("error al encontrar la data", error);
    } finally {
      this.removeActivityIndicationMessage();
    }
  }

  private removeActivityIndicationMessage() {
    const waitingIndicationMessage = document.getElementById(
      "Activity-indication-message"
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }

    const editBookForm = <HTMLFormElement>(
      document.querySelector("[name='edit-book-form']")
    );
    editBookForm.setAttribute("class", "");
  }
}

const editCtrl = new EditBooksController(
  new EditorialService(),
  new AuthorsService(),
  new BookService()
);
editCtrl.init();
