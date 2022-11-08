// Import all of Bootstrap's JS
import { Modal } from "bootstrap";
import { IUser } from "../../models/user";
import { UserService } from "../../services/users-service";
import { errorHandler } from "../../utils/error-handler";

class ListUserController {
  constructor(private userService: UserService) {
    const createButton = <HTMLButtonElement>(
      document.getElementById("create-button")
    );
    createButton.addEventListener("click", this.onClickCreateButton);
  }

  private onClickCreateButton = () => {
    window.location.href = "/users/create";
  };

  private onClickEditButton = async (event: Event) => {
    const editButtonElement = <HTMLButtonElement>event.target;
    const dataId = editButtonElement.getAttribute("data-id");

    window.location.href = `http://localhost:8080/users/edit/?id=${dataId}`;
  };

  private onClickDeleteButton = async (event: Event) => {
    const deleteButton = <HTMLButtonElement>event.target;

    const dataName = deleteButton.getAttribute("data-name");

    const myModalDeleteElement = <HTMLDivElement>(
      document.getElementById("delete-modal")
    );

    if (myModalDeleteElement !== null) {
      const myDeleteModal = new Modal(myModalDeleteElement);

      const modalBodyElement = <HTMLDivElement>(
        myModalDeleteElement.querySelector("div.modal-body")
      );
      modalBodyElement.textContent = `Quiere eliminar el usuario: ${dataName} ?`;

      const modalButtonYesElement = <HTMLButtonElement>(
        myModalDeleteElement.querySelector("#button-yes")
      );
      modalButtonYesElement.addEventListener("click", async () => {
        try {
          const idToDelete = deleteButton.getAttribute("data-id");
          if (idToDelete !== null) {
            await this.userService.deleteUser(idToDelete);
          }
          window.location.href = "http://localhost:8080/users/";
        } catch (error) {
          errorHandler("No se pudo eliminar el usuario", error);
        }
      });

      myDeleteModal.show();
    }
  };
  public async init() {
    try {
      const userDataList = await this.userService.getUsers();
      if (userDataList.length === 0) {
        const elementNoUsersAvailableMessage = document.querySelector(
          "#no-users-available"
        );
        if (elementNoUsersAvailableMessage !== null) {
          elementNoUsersAvailableMessage.setAttribute("class", "");
        }
      }

      this.renderUsers(userDataList);
      this.removeWaitingMessageRow();
    } catch (error) {
      errorHandler("No podemos encontrar los datos, intente nuevamente", error);
    }
  }

  private async renderUsers(userData: IUser[]) {
    const usersTableBodyElement = <HTMLTableElement>(
      document.querySelector("#users-table tbody")
    );
    const usersRowTemplateElement = <HTMLTemplateElement>(
      document.getElementById("users-row-template")
    );
    for (let i = 0; i < userData.length; i++) {
      const copyRowTemplate = document.importNode(
        usersRowTemplateElement.content,
        true
      );

      /** td name */
      const userNameTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='user-name']")
      );
      userNameTdElement.textContent = userData[i].name;

      /** td email */
      const emailTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='email']")
      );
      emailTdElement.textContent = userData[i].email;

      /** td role */
      const roleTdElement = <HTMLTableColElement>(
        copyRowTemplate.querySelector("[name='role']")
      );
      roleTdElement.textContent = userData[i].role;

      const editUserButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='edit-users-button']")
      );

      editUserButton.setAttribute("data-id", userData[i].id);
      editUserButton.addEventListener("click", this.onClickEditButton);
      editUserButton.classList.add("btn");
      editUserButton.classList.add("btn-secondary");

      const deleteUserButton = <HTMLButtonElement>(
        copyRowTemplate.querySelector("[name='delete-users-button']")
      );
      deleteUserButton.setAttribute("data-id", userData[i].id);
      deleteUserButton.setAttribute("data-name", userData[i].name);

      deleteUserButton.addEventListener("click", this.onClickDeleteButton);
      deleteUserButton.classList.add("btn");
      deleteUserButton.classList.add("btn-secondary");

      usersTableBodyElement.append(copyRowTemplate);
    }
  }
  private removeWaitingMessageRow() {
    const waitingMessageRow = document.getElementById("waiting-message-row");
    if (waitingMessageRow !== null) {
      waitingMessageRow.remove();
    }
  }
}
const listUserCtrl = new ListUserController(new UserService());
listUserCtrl.init();
