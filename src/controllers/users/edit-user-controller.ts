// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import { IUser } from "../../models/user";
import { UserService } from "../../services/users-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldEmail } from "../../utils/validateFieldEmail";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class EditUserController {
  constructor(private userService: UserService) {
    const saveButton = <HTMLButtonElement>(
      document.getElementById("save-user-button")
    );
    saveButton.addEventListener("click", this.onClickSaveButton);

    configureValidator("user-name", [{ type: "required" }]);
    configureValidator("email", [{ type: "required" }, { type: "email" }]);
    configureValidator("role", [{ type: "required" }]);
  }

  private getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }

  private onClickSaveButton = async (event: Event) => {
    if (this.validateEditUserForm() === true) {
      const userNameInputElement = <HTMLInputElement>(
        document.querySelector("[name='user-name']")
      );
      const emailInputElement = <HTMLInputElement>(
        document.querySelector("[name='email']")
      );
      const roleInputElement = <HTMLInputElement>(
        document.querySelector("[name='role']")
      );

      const user: IUser = {
        id: "",
        password: "",
        passwordVerification: "",
        name: userNameInputElement.value,
        email: emailInputElement.value,
        role: roleInputElement.value,
      };

      const id = this.getQueryParams().id;

      try {
        const updateUserResponseData = await this.userService.updateUser(
          id,
          user
        );
        alert("El usuario fue guardado correctamente");
        window.location.href = "/users";
      } catch (error) {
        errorHandler("No se pudo guardar el usuario", error);
      }
    }
  };
  public async init() {
    const params = this.getQueryParams();

    try {
      const userData = await this.userService.getUser(params.id);

      const userInputElement = <HTMLInputElement>(
        document.querySelector("[name='user-name']")
      );
      userInputElement.value = userData.name;

      const emailInputElement = <HTMLInputElement>(
        document.querySelector("[name='email']")
      );

      emailInputElement.value = userData.email;

      const roleInputElement = <HTMLInputElement>(
        document.querySelector("[name='role']")
      );
      roleInputElement.value = userData.role;
    } catch (error) {
      errorHandler("error al encontrar la data", error);
    } finally {
      this.removeActivityIndicationMessage();
    }
  }

  private validateEditUserForm() {
    let isFormValid = true;

    if (validateFieldRequired("user-name") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("email") === false) {
      isFormValid = false;
    }
    if (validateFieldEmail("email") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("role") === false) {
      isFormValid = false;
    }
    return isFormValid;
  }

  private removeActivityIndicationMessage() {
    const waitingIndicationMessage = <HTMLDivElement>(
      document.getElementById("Activity-indication-message")
    );
    if (waitingIndicationMessage !== null) {
      waitingIndicationMessage.remove();
    }
  }
}
const editUserCtrl = new EditUserController(new UserService());
editUserCtrl.init();
