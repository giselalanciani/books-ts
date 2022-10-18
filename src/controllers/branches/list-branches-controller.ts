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

    if (confirm(`Quiere eliminar el branch creado: ${name} ?`) == true)
      try {
        const idToDelete = deleteButtonElement.getAttribute("data-id");
        if (idToDelete !== null) {
          await this.branchService.deleteBranch(idToDelete);
        }

        window.location.href = "http://localhost:8080/branches/";
      } catch (error) {
        errorHandler("No se pudo eliminar el branch", error);
      }
  };

  private async renderBranch(branchData: IBranch[]) {
    const branchTable = <HTMLTableElement>(
      document.getElementById("branches-table")
    );
    const branchRowTemplate = <HTMLTemplateElement>(
      document.getElementById("branches-row-template")
    );

    for (let i = 0; i < branchData.length; i++) {
      const copyRowTemplate = document.importNode(
        branchRowTemplate.content,
        true
      );
      const nameInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameInput.textContent = branchData[i].name;

      const countryInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='country']")
      );
      const country = await this.countryService.getCountry(
        branchData[i].countryId
      );
      countryInput.textContent = country.name;

      const stateInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='state']")
      );
      const state = await this.stateService.getState(
        branchData[i].countryId,
        branchData[i].stateId
      );
      stateInput.textContent = state.name;

      const cityInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='city']")
      );
      cityInput.textContent = branchData[i].city;

      const streetInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='street']")
      );
      streetInput.textContent = branchData[i].street;

      const editBranchButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-branches-button']")
      );
      editBranchButton.setAttribute("data-id", branchData[i].id);
      editBranchButton.addEventListener("click", this.onClickEditButton);

      const deleteBranchButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-branches-button']")
      );
      deleteBranchButton.setAttribute("data-id", branchData[i].id);
      deleteBranchButton.setAttribute("data-name", branchData[i].name);
      deleteBranchButton.addEventListener("click", this.onClickDeleteButton);

      branchTable.append(copyRowTemplate);
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
