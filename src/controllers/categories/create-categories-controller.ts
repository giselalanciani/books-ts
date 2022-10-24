import { ICategory } from "../../models/category";
import { CategoriesServices } from "../../services/categories-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class CreateCategoryController {
  constructor(private categoryServices: CategoriesServices) {
    const createCategoryButton = <HTMLButtonElement>(
      document.getElementById("create-category-button")
    );
    createCategoryButton.addEventListener(
      "click",
      this.onClickCreateCategoryButton
    );
    configureValidator("category-name", [{ type: "required" }]);
  }
  private onClickCreateCategoryButton = async () => {
    if (this.validateCreateCategoryForm() === true) {
      await this.sendCategotyData();
    }
  };
  private validateCreateCategoryForm() {
    let isFormValid = true;

    if (validateFieldRequired("category-name") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }

  private sendCategotyData = async () => {
    const categoryNameInputElement = <HTMLInputElement>(
      document.querySelector("[name='category-name']")
    );

    const category: ICategory = {
      id: "",
      name: categoryNameInputElement.value,
    };

    try {
      await this.categoryServices.createCategory(category);
      alert("Categoria creada");
      window.location.href = "/categories";
    } catch (error) {
      errorHandler("No se pudo crear su categoria, intente mas tarde.", error);
    }
    this.removeWaitingMessageRow();
  };

  private removeWaitingMessageRow() {
    const waitingMessageRow = document.getElementById("waiting-message-row");
    if (waitingMessageRow !== null) {
      waitingMessageRow.remove();
    }
  }
}
const createCategoryCtrl = new CreateCategoryController(
  new CategoriesServices()
);
