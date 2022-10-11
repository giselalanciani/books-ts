import { ICategory } from "../../models/category";
import { CategoriesServices } from "../../services/categories-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";

class ListCategoriesController {
  constructor(private categoryService: CategoriesServices) {
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);

   
  }
  private onClickCreateButton = () => {
    console.log("hizo click");
    window.location.href = "/categories/create";
  };

  private onClickEditButton = (event: Event) => {
    const editButton = <HTMLButtonElement>event.target;
    const id = editButton.getAttribute("data-id");

    window.location.href = `http://localhost:8080/categories/edit/?id=${id}`;
  };
  private onClickDeleteButton = async (event: Event) => {
    const deleteButtonElement = <HTMLButtonElement>event.target;
    const name = deleteButtonElement.getAttribute("data-name");    

    if (confirm(`Quiere eliminar la categoria creada: ${name} ?`) == true)
      try {
        const idToDelete = deleteButtonElement.getAttribute("data-id");
        if (idToDelete !== null) {
          await this.categoryService.deleteCategory(idToDelete);
        }

        window.location.href = "http://localhost:8080/categories/";
      } catch (error) {
        errorHandler("No se pudo eliminar el branch", error);
      }
  };

  private renderCategories(categoriesData: ICategory[]) {
    const categoriesTable = <HTMLTableElement>(
      document.getElementById("categories-table")
    );
    const categoriesRowTemplate = <HTMLTemplateElement>(
      document.getElementById("categories-row-template")
    );
    for (let i = 0; i < categoriesData.length; i++) {
      const copyRowTemplate = document.importNode(
        categoriesRowTemplate.content,
        true
      );
      const nameInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameInput.textContent = categoriesData[i].name;

      const editCategoriesButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-categories-button']")
      );

      editCategoriesButton.setAttribute("data-id", categoriesData[i].id);
      editCategoriesButton.addEventListener("click", this.onClickEditButton);

      const deleteCategoriesButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-categories-button']")
      );
      deleteCategoriesButton.setAttribute("data-id", categoriesData[i].id);
      deleteCategoriesButton.setAttribute("data-name", categoriesData[i].name);

      deleteCategoriesButton.addEventListener(
        "click",
        this.onClickDeleteButton
      );

      categoriesTable.append(copyRowTemplate);
    }
  }

  public async init() {
    try {
      const categoryDataList = await this.categoryService.getCategories();

      if (categoryDataList.length === 0) {
        const elementNoCategoriesAvailableMessage = document.querySelector(
          "#no-categories-available"
        );
        if (elementNoCategoriesAvailableMessage !== null) {
          elementNoCategoriesAvailableMessage.setAttribute("class", "");
        }
      }

      this.renderCategories(categoryDataList);

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
}
const ListCategoriesCtrl = new ListCategoriesController(
  new CategoriesServices()
);
ListCategoriesCtrl.init();
