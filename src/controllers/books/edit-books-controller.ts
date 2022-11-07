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
import {
  getSelectValues,
  setSelectValues,
} from "../../utils/getSelectedOptions";
import { validateFieldNumeric } from "../../utils/validateFieldNumeric";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditBooksController {
  constructor(
    private editorialService: EditorialService,
    private authorsService: AuthorsService,
    private bookService: BookService,
    private categorieService: CategoriesServices
  ) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-book-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("bookname");
    configureValidator("year", [{ type: "required" }, { type: "numeric" }]);
    configureValidator("editorial");
    configureValidator("authors");
    configureValidator("stock", [{ type: "required" }, { type: "numeric" }]);
    configureValidator("price", [{ type: "required" }, { type: "numeric" }]);
    configureValidator("categories");
  }

  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }

  private onClickSaveButton = async (event: Event) => {
    event.preventDefault();
    if (this.validateEditBookForm()) {
      try {
        const bookNameInputElement = <HTMLInputElement>(
          document.querySelector("[name='bookname']")
        );
        const bookYearInputElement = <HTMLInputElement>(
          document.querySelector("[name='year']")
        );
        const stockInputElement = <HTMLInputElement>(
          document.querySelector("[name='stock']")
        );
        const priceInputElement = <HTMLInputElement>(
          document.querySelector("[name='price']")
        );
        const authorsSelectorElement = <HTMLSelectElement>(
          document.querySelector("[name='authors']")
        );
        const editorialSelectorElement = <HTMLSelectElement>(
          document.querySelector("[name='editorial']")
        );
        const categoriesSelectorElement = <HTMLSelectElement>(
          document.querySelector("[name='categories']")
        );
        const selectedCategoriesList = getSelectValues(
          categoriesSelectorElement
        );

        const book: Ibook = {
          id: "",
          name: bookNameInputElement.value,
          year: bookYearInputElement.value,
          stock: stockInputElement.value,
          price: priceInputElement.value,
          author: authorsSelectorElement.value,
          editorial: editorialSelectorElement.value,
          categories: selectedCategoriesList,
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
    const authorsSelectElement = <HTMLSelectElement>document.getElementById("authors");

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
    const editorialSelectElement = <HTMLSelectElement>(
      document.getElementById("editorial")
    );

    const editorialTemplateElement = <HTMLTemplateElement>(
      document.getElementById("editorial-template")
    );

    for (let i = 0; i < editorialDataList.length; i++) {
      const copyEditorialTemplate = document.importNode(
        editorialTemplateElement.content,
        true
      );

      const newEditorialOption = <HTMLOptionElement>(
        copyEditorialTemplate.querySelector("option")
      );

      newEditorialOption.textContent = `${editorialDataList[i].name}`;
      newEditorialOption.setAttribute("value", `${editorialDataList[i].id}`);

      editorialSelectElement.append(newEditorialOption);
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
      newCategoryOptionElement.setAttribute("value", `${catergoriesDataList[i].id}`);
      categorySelectElement.append(newCategoryOptionElement);
    }
  }

  public async init() {
    const params = this.getQueryParams();

    try {
      const bookData = await this.bookService.getBook(params.id);
      const authorsData = await this.authorsService.getAuthors();
      const editoriasData = await this.editorialService.getEditorials();
      const categoriesData = await this.categorieService.getCategories();

      this.renderAuthors(authorsData);
      this.renderEditorials(editoriasData);
      this.renderCategories(categoriesData);

      const bookInputElement = <HTMLInputElement>(
        document.querySelector("[name='bookname']")
      );
      bookInputElement.value = bookData.name;

      const yearInputElement = <HTMLInputElement>(
        document.querySelector("[name='year']")
      );
      yearInputElement.value = bookData.year;

      const stockInputElemet = <HTMLInputElement>(
        document.querySelector("[name='stock']")
      );
      stockInputElemet.value = bookData.stock;

      const priceInputElement = <HTMLInputElement>(
        document.querySelector("[name='price']")
      );
      priceInputElement.value = bookData.price;

      const authorsSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='authors']")
      );
      authorsSelectorElement.value = bookData.author;

      const editorialSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='editorial']")
      );
      editorialSelectorElement.value = bookData.editorial;

      const categoriesList = await this.categorieService.getCategories();
      this.renderCategories(categoriesList);

      const categoriesSelectorElement = <HTMLSelectElement>(
        document.querySelector("[name='categories']")
      );

      setSelectValues(categoriesSelectorElement, bookData.categories);
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
  new BookService(),
  new CategoriesServices()
);
editCtrl.init();
