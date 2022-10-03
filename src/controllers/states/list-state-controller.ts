import { ICountry } from "../../models/country";
import { IState } from "../../models/state";
import { CountryServices } from "../../services/country-service";
import { StateService } from "../../services/states-service";
import { errorHandler } from "../../utils/error-handler";
import { getQueryParams } from "../../utils/getQueryParams";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class ListStatesController {
  stateService;
  countryService;
  constructor(stateService: StateService, countryService: CountryServices) {
    this.countryService = countryService;
    this.stateService = stateService;
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);

    const countrySelect = <HTMLSelectElement>document.getElementById("country");
    countrySelect.addEventListener("change", this.onChangeCountrySelect);
  }

  onClickCreateButton() {
    window.location.href = "/states/create";
  }

  onClickEditButton = async (event: Event) => {
    const editButton = <HTMLButtonElement>event.target;
    const id = editButton.getAttribute("data-id");
    const countryId = editButton.getAttribute("data-country-id");

    window.location.href = `http://localhost:8080/states/edit/?id=${id}&countryId=${countryId}`;
  };

  onClickDeleteButton = async (event: Event) => {
    if (confirm(`Desea eliminar el estado?`) == true)
      try {
        const stateId = (<HTMLButtonElement>event.target).getAttribute(
          "data-id"
        );
        const countryId = (<HTMLButtonElement>event.target).getAttribute(
          "data-country-id"
        );
        if (countryId !== null && stateId !== null) {
          await this.stateService.deleteState(countryId, stateId);
        }

        window.location.href = "http://localhost:8080/states/";
      } catch (error) {
        errorHandler("No se pudo eliminar el estado", error);
      }
  };

  validateListStateForm() {
    let isFormValid = true;

    if (validateFieldRequired("statename") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("country") === false) {
      isFormValid = false;
    }

    return isFormValid;
  }
  onChangeCountrySelect = async (event: Event) => {
    const stateTable = <HTMLTableElement>document.getElementById("state-table");
    stateTable.classList.remove("hidden");

    const countrySelect = <HTMLSelectElement>event.target;
    const countryId = countrySelect.value;
    if (countryId !== null)
      if (countryId) {
        stateTable.classList.remove("hidden");
        try {
          this.deleteTableRows();
          const elementWaitingMessageRowMessage = <HTMLSelectElement>(
            document.querySelector("#waiting-message-row")
          );
          elementWaitingMessageRowMessage.classList.remove("hidden");

          const statesList = await this.stateService.getStates(countryId);
          const elementNoStatesAvailableMessage = document.querySelector(
            "#no-states-available"
          );

          elementWaitingMessageRowMessage.classList.add("hidden");

          if (statesList.length === 0) {
            elementNoStatesAvailableMessage?.classList.remove("hidden");
          } else {
            elementNoStatesAvailableMessage?.classList.add("hidden");
          }
          this.renderStates(statesList);
        } catch (error) {
          errorHandler("error al cargar countries", error);
        }
      } else {
        stateTable.classList.add("hidden");
      }
  };

  deleteTableRows() {
    const stateTable = <HTMLTableElement>document.getElementById("state-table");
    const tableTrs = stateTable.querySelectorAll("tr");
    tableTrs.forEach((tr) => {
      if (
        tr.id === "no-states-available" ||
        tr.id === "waiting-message-row" ||
        tr.id === "table-header"
      ) {
        console.log("no elimina", tr.id);
      } else {
        tr.remove();
      }
    });
  }

  renderStates(statesList: IState[]) {
    const stateTable = <HTMLTableElement>document.getElementById("state-table");
    const stateRowTemplate = <HTMLTemplateElement>(
      document.getElementById("state-row-template")
    );

    for (let i = 0; i < statesList.length; i++) {
      const copyRowTemplate = document.importNode(
        stateRowTemplate.content,
        true
      );

      const nameTd = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='name']")
      );
      nameTd.textContent = statesList[i].name;

      const editStateButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-state-button']")
      );
      editStateButton.setAttribute("data-id", statesList[i].id);
      editStateButton.setAttribute("data-country-id", statesList[i].countryId);
      editStateButton.addEventListener("click", this.onClickEditButton);

      const deleteStateButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-state-button']")
      );

      deleteStateButton.setAttribute("data-id", statesList[i].id);
      deleteStateButton.setAttribute(
        "data-country-id",
        statesList[i].countryId
      );
      deleteStateButton.addEventListener("click", this.onClickDeleteButton);

      stateTable.append(copyRowTemplate);
    }
  }
  renderCountries(countryDataList: ICountry[]) {
    const countrySelect = <HTMLSelectElement>document.getElementById("country");

    const countryTemplate = <HTMLTemplateElement>(
      document.getElementById("state-create-template")
    );

    for (let i = 0; i < countryDataList.length; i++) {
      const copyCountryTemplate = document.importNode(
        countryTemplate.content,
        true
      );

      const newStateOption = copyCountryTemplate.querySelector("option");
      if (newStateOption !== null) {
        newStateOption.textContent = `${countryDataList[i].name}`;
        newStateOption.setAttribute("value", `${countryDataList[i].id}`);
        countrySelect.append(newStateOption);
      }
    }

    const params = getQueryParams();
    const countryId = params.countryId;
    countrySelect.value = countryId;
    countrySelect.dispatchEvent(new Event("change"));
  }

  async init() {
    try {
      const countryDataList = await this.countryService.getCountries();
      this.renderCountries(countryDataList);
    } catch (error) {
      errorHandler("No podemos encontrar los datos, intente nuevamente", error);
    }
  }
}

const listStateController = new ListStatesController(
  new StateService(),
  new CountryServices()
);
listStateController.init();
