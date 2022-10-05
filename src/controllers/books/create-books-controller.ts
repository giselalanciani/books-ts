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

/**
 * 1) El boton salvar
 *      Al hacer click ->
 *          1) Validacion
 *              1) Debe hacer un POST a la API de books
 *              2) Muestra un alert con un mejaje que diga "Se guardo el libro".
 *              3) Debe redireccionar a la location de /books
 *          2) Si la validacion no es correcta
 *              1) muestra un mejs con el error.
 *
 * 1.b Cómo?
 *      1) Buscamos un boton por su nombre con document.querySelector()  "click"
 *      2) A ese boton encontrado, le asignamos una funcion de event Handler
 *          2.1) esta funcion, va a ser un methodo de la clase controller
 *          2.2) Meter un console log para saber que funciona.
 *
 *
 *
 *
 *
 */
class CreateBooksController {
  constructor(
    private editorialsService: EditorialService,
    private authorsService: AuthorsService,
    private bookService: BookService
  ) {
    const createBookButton = <HTMLButtonElement>(
      document.getElementById("create-book-button")
    );
    createBookButton.addEventListener("click", this.onClickCreateBookButton);

    configureValidator("bookname");
    configureValidator("year", ["required", "numeric"]);
    configureValidator("editorial");
    configureValidator("authors");
    configureValidator("stock", ["required", "numeric"]);
    configureValidator("price", ["required", "numeric"]);
  }

  private onClickCreateBookButton = () => {
    if (this.validateCreateBookForm() === true) {
      this.sendData();
    }
  };

  private sendData = async () => {
    try {
      const bookNameInput = <HTMLInputElement>(
        document.querySelector("[name='bookname']")
      );
      const bookYearInput = <HTMLInputElement>(
        document.querySelector("[name='year']")
      );
      const authorSelector = <HTMLSelectElement>(
        document.querySelector("[name='authors']")
      );
      const editorialSelector = <HTMLSelectElement>(
        document.querySelector("[name='editorial']")
      );
      const stockInput = <HTMLInputElement>(
        document.querySelector("[name='stock']")
      );
      const priceInput = <HTMLInputElement>(
        document.querySelector("[name='price']")
      );

      const book: Ibook = {
        id: "",
        name: bookNameInput.value,
        year: bookYearInput.value,
        author: authorSelector.value,
        editorial: editorialSelector.value,
        stock: stockInput.value,
        price: priceInput.value,
      };

      await this.bookService.createBook(book);
      alert("Los datos fueron guardados");
      window.location.href = "/books";
    } catch (error) {
      errorHandler("No se pudo craer su libro", error);
    }
  };

 private validateCreateBookForm() {
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

 public async init() {
    try {
      const editorialsData = await this.editorialsService.getEditorials();
      const authorsData = await this.authorsService.getAuthors();
      this.renderEditorials(editorialsData);
      this.renderAuthors(authorsData);
    } catch (error) {
      errorHandler("error al sincronizar datos", error);
    }
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
    const editorialSelect = document.getElementById("editorial");

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
      if (editorialSelect !== null) {
        editorialSelect.append(newEditorialOption);
      }
    }
  }
}

const createCtrl = new CreateBooksController(
  new EditorialService(),
  new AuthorsService(),
  new BookService()
);
createCtrl.init();
