import { ICategory } from "../../models/category";
import { IClient } from "../../models/client";
import { ICountry } from "../../models/country";
import { IState } from "../../models/state";
import { CategoriesServices } from "../../services/categories-service";
import { ClientService } from "../../services/clients";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { errorHandler } from "../../utils/error-handler";

class clientListController {
  constructor(
    private clientService: ClientService,
    private countryService: CountryServices,
    private stateService: StateService,
    private categorieService: CategoriesServices
  ) {
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
    const id = (<HTMLButtonElement>event.target).getAttribute("data-id");
    try {
      if (id !== null) {
        await this.clientService.deleteClient(id);
      }
      alert("Cliente eliminado");
      window.location.href = "/clients";
    } catch (error) {
      errorHandler("No se pudo eliminar el cliente, intente mas tarde.", error);
    }
  };

  private async renderClients(clientsData: IClient[]) {
    const clientsTableBodyElement = <HTMLTableElement>(
      document.querySelector("#clients-table tbody")
    );
    const clientsRowTemplateElement = <HTMLTemplateElement>(
      document.getElementById("client-row-template")
    );
    for (let i = 0; i < clientsData.length; i++) {
      const copyRowTemplate = document.importNode(
        clientsRowTemplateElement.content,
        true
      );

      /** td name */
      const clientNameElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='client-name']")
      );
      clientNameElement.textContent = clientsData[i].name;

      /** td email */
      const emailElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='email']")
      );
      emailElement.textContent = clientsData[i].email;

      /** td country */
      const countryTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='country']")
      );
      const countryModel = await this.countryService.getCountry(
        clientsData[i].countryId
      );
      countryTdElement.textContent = countryModel.name;

      /** td state*/
      const stateTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='state']")
      );
      const stateModel = await this.stateService.getState(
        clientsData[i].countryId,
        clientsData[i].stateId
      );
      stateTdElement.textContent = stateModel.name;

      /** td city */
      const cityElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='city']")
      );
      cityElement.textContent = clientsData[i].cityName;

      /** td street */
      const streetElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='street']")
      );
      streetElement.textContent = clientsData[i].street;

      /** td liked Categories */

      const likedCategoriesElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='liked-categories']")
      );
      let likedCategories = "";
      for (let j = 0; j < clientsData[i].likedCategories.length; j++) {
        const categoryModel = await this.categorieService.getCategory(
          clientsData[i].likedCategories[j]
        );
        if (j === 0) {
          likedCategories = likedCategories + categoryModel.name;
        } else {
          likedCategories = likedCategories + ", " + categoryModel.name;
        }
      }
      likedCategoriesElement.textContent = likedCategories;

      const editClientButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-client-button']")
      );
      editClientButton.setAttribute("data-id", clientsData[i].id);
      editClientButton.addEventListener("click", this.onClickEditButton);
      editClientButton.classList.add("btn");
      editClientButton.classList.add("btn-secondary");

      const deleteClientButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-client-button']")
      );
      deleteClientButton.setAttribute("data-id", clientsData[i].id);

      deleteClientButton.addEventListener("click", this.onClickDeleteButton);
      deleteClientButton.classList.add("btn");
      deleteClientButton.classList.add("btn-secondary");

      clientsTableBodyElement.append(copyRowTemplate);
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
const clientListCtrl = new clientListController(
  new ClientService(),
  new CountryServices(),
  new StateService(),
  new CategoriesServices()
);
clientListCtrl.init();
