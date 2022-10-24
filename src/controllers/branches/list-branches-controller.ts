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
    const branchTableElement = <HTMLTableElement>(
      document.getElementById("branches-table")
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

      const deleteBranchButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-branches-button']")
      );
      deleteBranchButton.setAttribute("data-id", branchData[i].id);
      deleteBranchButton.setAttribute("data-name", branchData[i].name);
      deleteBranchButton.addEventListener("click", this.onClickDeleteButton);

      branchTableElement.append(copyRowTemplate);
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
