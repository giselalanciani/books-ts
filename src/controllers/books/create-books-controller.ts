// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import { IAuthor } from "../../models/author";
import { Ibook } from "../../models/book";
import { ICategory } from "../../models/category";
import { IEditorial } from "../../models/editorial";
import { AuthorsService } from "../../services/authors-service";
import { BookService } from "../../services/book-service";
import { CategoriesServices } from "../../services/categories-service";
import { EditorialService } from "../../services/editorial-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { getSelectValues } from "../../utils/getSelectedOptions";
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
    private bookService: BookService,
    private categorieService: CategoriesServices
  ) {
    const createBookButton = <HTMLButtonElement>(
      document.getElementById("create-book-button")
    );
    createBookButton.addEventListener("click", this.onClickCreateBookButton);

    configureValidator("bookname");
    configureValidator("year", [{ type: "required" }, { type: "numeric" }]);
    configureValidator("editorial");
    configureValidator("authors");
    configureValidator("stock", [{ type: "required" }, { type: "numeric" }]);
    configureValidator("price", [{ type: "required" }, { type: "numeric" }]);
    configureValidator("categories");
  }

  private onClickCreateBookButton = (event: Event) => {
    event.preventDefault();
    if (this.validateCreateBookForm() === true) {
      this.sendData();
    }
  };

  private sendData = async () => {
    try {
      const bookNameInputElement = <HTMLInputElement>(
        document.querySelector("[name='bookname']")
      );
      const bookYearInputElement = <HTMLInputElement>(
        document.querySelector("[name='year']")
      );
      const authorSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='authors']")
      );
      const editorialSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='editorial']")
      );
      const stockInputElement = <HTMLInputElement>(
        document.querySelector("[name='stock']")
      );
      const priceInputElement = <HTMLInputElement>(
        document.querySelector("[name='price']")
      );
      const categorieSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='categories']")
      );
      const selectedCategoriesList = getSelectValues(categorieSelectorElement);

      const book: Ibook = {
        id: "",
        name: bookNameInputElement.value,
        year: bookYearInputElement.value,
        author: authorSelectorElement.value,
        editorial: editorialSelectorElement.value,
        stock: stockInputElement.value,
        price: priceInputElement.value,
        categories: selectedCategoriesList,
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

    if (validateFieldRequired("categories") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  public async init() {
    try {
      const editorialsData = await this.editorialsService.getEditorials();
      const authorsData = await this.authorsService.getAuthors();
      const categoriesData = await this.categorieService.getCategories();
      this.renderEditorials(editorialsData);
      this.renderAuthors(authorsData);
      this.renderCategories(categoriesData);
    } catch (error) {
      errorHandler("error al sincronizar datos", error);
    }
  }

  private renderAuthors(authorsDataList: IAuthor[]) {
    const authorsSelectElement = <HTMLSelectElement>(
      document.getElementById("authors")
    );

    const authorOptionTemplateElement = <HTMLTemplateElement>(
      document.getElementById("author-option-template")
    );

    for (let i = 0; i < authorsDataList.length; i++) {
      const copyAuthorOptionTemplate = document.importNode(
        authorOptionTemplateElement.content,
        true
      );

      const newAuthorOption = <HTMLOptionElement>(
        copyAuthorOptionTemplate.querySelector("option")
      );

      newAuthorOption.textContent = `${authorsDataList[i].name}`;
      newAuthorOption.setAttribute("value", `${authorsDataList[i].name}`);

      authorsSelectElement.append(newAuthorOption);
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

  private renderCategories(catergoriesDataList: ICategory[]) {
    const categorySelectElement = <HTMLSelectElement>(
      document.getElementById("categories")
    );

    const categoryOptionTemplateElement = <HTMLTemplateElement>(
      document.getElementById("categories-option-template")
    );

    for (let i = 0; i < catergoriesDataList.length; i++) {
      const copyCategoryTemplate = document.importNode(
        categoryOptionTemplateElement.content,
        true
      );

      const newCategoryOptionElement = <HTMLOptionElement>(
        copyCategoryTemplate.querySelector("option")
      );

      newCategoryOptionElement.textContent = `${catergoriesDataList[i].name}`;
      newCategoryOptionElement.setAttribute(
        "value",
        `${catergoriesDataList[i].id}`
      );
      categorySelectElement.append(newCategoryOptionElement);
    }
  }
}

const createCtrl = new CreateBooksController(
  new EditorialService(),
  new AuthorsService(),
  new BookService(),
  new CategoriesServices()
);
createCtrl.init();
