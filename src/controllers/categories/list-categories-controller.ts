// Import all of Bootstrap's JS
import { Modal, Toast } from "bootstrap";
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

    const myModalDeleteElement = <HTMLDivElement>(
      document.getElementById("delete-modal")
    );

    if (myModalDeleteElement !== null) {
      const myDeleteModal = new Modal(myModalDeleteElement);

      const modalBodyElement = <HTMLDivElement>(
        myModalDeleteElement.querySelector("div.modal-body")
      );
      modalBodyElement.textContent = `Quiere eliminar la categoria creada: ${name} ?`;

      const modalButtonYesElement = <HTMLButtonElement>(
        myModalDeleteElement.querySelector("#button-yes")
      );
      const toastModalElement = <HTMLDivElement>(
        document.querySelector("#delete-toast")
      );
      const toast = new Toast(toastModalElement);
      modalButtonYesElement.addEventListener("click", async () => {
        myDeleteModal.hide();
        try {
          const idToDelete = deleteButtonElement.getAttribute("data-id");
          if (idToDelete !== null) {
            await this.categoryService.deleteCategory(idToDelete);
          }
        } catch (error) {
          errorHandler("No se pudo eliminar el branch", error);
        } finally {
          if (toastModalElement !== null) {
            toast.show();
          }
          setTimeout(() => {
            window.location.href = "http://localhost:8080/categories/";
          }, 1000);
        }
      });

      myDeleteModal.show();
    }
  };

  private renderCategories(categoriesData: ICategory[]) {
    const categoriesTableBodyElement = <HTMLTableElement>(
      document.querySelector("#categories-table tbody")
    );
    const categoriesRowTemplateElement = <HTMLTemplateElement>(
      document.getElementById("categories-row-template")
    );
    for (let i = 0; i < categoriesData.length; i++) {
      const copyRowTemplate = document.importNode(
        categoriesRowTemplateElement.content,
        true
      );
      const nameTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameTdElement.textContent = categoriesData[i].name;

      const editCategoriesButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-categories-button']")
      );

      editCategoriesButton.setAttribute("data-id", categoriesData[i].id);
      editCategoriesButton.addEventListener("click", this.onClickEditButton);
      editCategoriesButton.classList.add("btn");
      editCategoriesButton.classList.add("btn-secondary");

      const deleteCategoriesButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-categories-button']")
      );
      deleteCategoriesButton.setAttribute("data-id", categoriesData[i].id);
      deleteCategoriesButton.setAttribute("data-name", categoriesData[i].name);
      deleteCategoriesButton.classList.add("btn");
      deleteCategoriesButton.classList.add("btn-secondary");

      deleteCategoriesButton.addEventListener(
        "click",
        this.onClickDeleteButton
      );

      categoriesTableBodyElement.append(copyRowTemplate);
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
