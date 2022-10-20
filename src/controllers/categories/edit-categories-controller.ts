import { ICategory } from "../../models/category";
import { CategoriesServices } from "../../services/categories-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";

class EditCategoriesController {
  constructor(private categorieService: CategoriesServices) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-category-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("category-name", [{type: "required"}]);
  }
  private onClickSaveButton = async (event: Event) => {
    if (this.validateEditForm()) {
      try {
        const categoriesNameInput = <HTMLInputElement>(
          document.querySelector("[name='category-name']")
        );

        const id = this.getQueryParams().id;
        const categoryId: ICategory = {
          id: id,
          name: categoriesNameInput.value,
        };

        await this.categorieService.updateCategory(id, categoryId);
        alert("Los datos fueron guardados");
        window.location.href = "/categories";
      } catch (error) {
        errorHandler(
          "La categoría no puede ser guardada en este momento, por favor intente nuevamente",
          error
        );
      }
    }
  };
  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }
  private validateEditForm() {
    const editNameInput = <HTMLInputElement>(
      document.querySelector("[name='category-name']")
    );
    const nameRequiredError = <HTMLSelectElement>(
      document.querySelector("[name='category-name-required']")
    );
    if (editNameInput.value == "") {
      nameRequiredError.classList.remove("hidden");
      return false;
    }
    nameRequiredError.classList.add("hidden");
    return true;
  }
  public async init() {
    const params = this.getQueryParams();
    const id = params.id;
    try {
      const categoriesData = await this.categorieService.getCategory(id);

      const categoryInput = <HTMLInputElement>(
        document.querySelector("[name='category-name']")
      );
      categoryInput.value = categoriesData.name;
    } catch (error) {
      errorHandler("Error en la busqueda,vualva a intentarlo luego", error);
    } finally {
      this.removeActivityIndicationMessage();
    }
  }
  private removeActivityIndicationMessage() {
    const waitingIndicationMessage = <HTMLDivElement>(
      document.getElementById("Activity-indication-message")
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }
  }
}
const editCategoriesCtrl = new EditCategoriesController(
  new CategoriesServices()
);
editCategoriesCtrl.init();
