// Import all of Bootstrap's JS
import { Modal, Toast } from "bootstrap";
import { IBranch } from "../../models/branch";
import { BranchService } from "../../services/branch-service";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { errorHandler } from "../../utils/error-handler";

class ListBranchesController {
  constructor(
    private branchService: BranchService,
    private countryService: CountryServices,
    private stateService: StateService
  ) {
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);
  }

  private onClickCreateButton = () => {
    window.location.href = "/branches/create";
  };

  private onClickEditButton = (event: Event) => {
    const editButton = <HTMLButtonElement>event.target;
    const dataId = editButton.getAttribute("data-id");

    window.location.href = `http://localhost:8080/branches/edit/?id=${dataId}`;
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
      modalBodyElement.textContent = `Quiere eliminar el branch creado: ${name} ?`;

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
            await this.branchService.deleteBranch(idToDelete);
          }
        } catch (error) {
          errorHandler("No se pudo eliminar el branch", error);
        } finally {
          if (toastModalElement !== null) {
            toast.show();
          }
          setTimeout(() => {
            window.location.href = "http://localhost:8080/branches/";
          }, 1000);
        }
      });

      myDeleteModal.show();
    }
  };

  private async renderBranch(branchData: IBranch[]) {
    const branchTableBodyElement = <HTMLTableElement>(
      document.querySelector("#branches-table tbody")
    );
    const branchRowTemplateElement = <HTMLTemplateElement>(
      document.getElementById("branches-row-template")
    );

    for (let i = 0; i < branchData.length; i++) {
      const copyRowTemplate = document.importNode(
        branchRowTemplateElement.content,
        true
      );
      const nameTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameTdElement.textContent = branchData[i].name;

      const countryTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='country']")
      );
      const country = await this.countryService.getCountry(
        branchData[i].countryId
      );
      countryTdElement.textContent = country.name;

      const stateTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='state']")
      );
      const state = await this.stateService.getState(
        branchData[i].countryId,
        branchData[i].stateId
      );
      stateTdElement.textContent = state.name;

      const cityTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='city']")
      );
      cityTdElement.textContent = branchData[i].city;

      const streetTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='street']")
      );
      streetTdElement.textContent = branchData[i].street;

      const editBranchButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-branches-button']")
      );
      editBranchButton.setAttribute("data-id", branchData[i].id);
      editBranchButton.addEventListener("click", this.onClickEditButton);
      editBranchButton.classList.add("btn");
      editBranchButton.classList.add("btn-secondary");

      const deleteBranchButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-branches-button']")
      );
      deleteBranchButton.setAttribute("data-id", branchData[i].id);
      deleteBranchButton.setAttribute("data-name", branchData[i].name);
      deleteBranchButton.addEventListener("click", this.onClickDeleteButton);
      deleteBranchButton.classList.add("btn");
      deleteBranchButton.classList.add("btn-secondary");

      branchTableBodyElement.append(copyRowTemplate);
    }
  }

  public async init() {
    try {
      const branchDataList = await this.branchService.getBranches();

      if (branchDataList.length === 0) {
        const elementNoBranchesAvailableMessage = document.querySelector(
          "#no-branches-available"
        );
        if (elementNoBranchesAvailableMessage !== null) {
          elementNoBranchesAvailableMessage.setAttribute("class", "");
        }
      }

      await this.renderBranch(branchDataList);

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

const listBranchesController = new ListBranchesController(
  new BranchService(),
  new CountryServices(),
  new StateService()
);
listBranchesController.init();
