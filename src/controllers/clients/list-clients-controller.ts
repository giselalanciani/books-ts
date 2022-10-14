import { IClient } from "../../models/client";
import { ClientService } from "../../services/clients";
import { errorHandler } from "../../utils/error-handler";

class clientListController {
  constructor(private clientService: ClientService) {
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);
  }

  private onClickCreateButton = () => {
    window.location.href = "/clients/create";
  };

  private onClickEditButton = async (event: Event) => {
    const editButtonElement = <HTMLButtonElement>event.target;
    const dataId = editButtonElement.getAttribute("data-id");

    window.location.href = `http://localhost:8080/clients/edit/?id=${dataId}`;
  };

  private onClickDeleteButton = async (event: Event) => {
    const deleteButton = <HTMLButtonElement>event.target;
    const dataName = deleteButton.getAttribute("data-name");

    if (confirm(`Quiere eliminar el cliente ${dataName} ?`) == true)
      try {
        const idToDelete = deleteButton.getAttribute("data-id");
        if (idToDelete !== null) {
          await this.clientService.deleteClient(idToDelete);
        }

        window.location.href = "http://localhost:8080/clients/";
      } catch (error) {
        errorHandler("No se pudo eliminar su libro", error);
      }
  };

  private renderClients(clientsData: IClient[]) {
    const clientsTable = <HTMLTableElement>(
      document.getElementById("clients-table")
    );
    const clientsRowTemplate = <HTMLTemplateElement>(
      document.getElementById("client-row-template")
    );
    for (let i = 0; i < clientsData.length; i++) {
      const copyRowTemplate = document.importNode(
        clientsRowTemplate.content,
        true
      );
      const clientNameInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='client-name']")
      );
      clientNameInput.textContent = clientsData[i].name;

      const emailInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='email']")
      );
      emailInput.textContent = clientsData[i].email;

      const countrySelect = <HTMLSelectElement>(
        copyRowTemplate.querySelector("[name='country']")
      );
      countrySelect.textContent = clientsData[i].countryId;

      const stateSelect = <HTMLSelectElement>(
        copyRowTemplate.querySelector("[name='state']")
      );
      stateSelect.textContent = clientsData[i].stateId;

      const cityInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='city']")
      );
      cityInput.textContent = clientsData[i].cityName;

      const streetInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='street']")
      );
      streetInput.textContent = clientsData[i].street;

      const likedCategoriesInput = <HTMLInputElement>(
        copyRowTemplate.querySelector("[name='liked-categories']")
      );
      likedCategoriesInput.textContent = clientsData[i].likedCategories.join(',');

      const editClientButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-client-button']")
      );
      editClientButton.setAttribute("data-id", clientsData[i].id);
      editClientButton.addEventListener("click", this.onClickEditButton);

      const deleteClientButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-client-button']")
      );
      deleteClientButton.setAttribute("data-id", clientsData[i].id);

      deleteClientButton.addEventListener("click", this.onClickDeleteButton);

      clientsTable.append(copyRowTemplate);
    }
  }
  public async init() {
    try {
      const clientDataList = await this.clientService.getClients();
      if (clientDataList.length === 0) {
        const elementNoClientAvailableMessage = document.querySelector(
          "#no-clients-available"
        );
        if (elementNoClientAvailableMessage !== null) {
          elementNoClientAvailableMessage.setAttribute("class", "");
        }
      }
      this.renderClients(clientDataList);
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
const clientListCtrl = new clientListController(new ClientService());
clientListCtrl.init();
