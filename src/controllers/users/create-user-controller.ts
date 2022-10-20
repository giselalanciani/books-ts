import { IUser } from "../../models/user";
import { UserService } from "../../services/users-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldDependentEqual } from "../../utils/validateFieldDependentEqual";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class CreateUserController {
  constructor(private userService: UserService) {
    const createUserButton = <HTMLButtonElement>(
      document.getElementById("create-user-button")
    );
    createUserButton.addEventListener("click", this.onClickCreateUserButton);

    configureValidator("user-name", [{ type: "required" }]);
    configureValidator("email", [{ type: "required" }]);
    configureValidator("password", [{ type: "required" }]);
    configureValidator("password-verification", [
      { type: "required" },
      { type: "dependent-equal", config: { dependentFieldName: "password" } },
    ]);
    configureValidator("role", [{ type: "required" }]);
  }

  private onClickCreateUserButton = async () => {
    if (this.validateCreateUserForm() === true) {
      await this.sendData();
    }
  };

  private sendData = async () => {
    try {
      const userNameInputElement = <HTMLInputElement>(
        document.querySelector("[name='user-name']")
      );
      const emailInputElement = <HTMLInputElement>(
        document.querySelector("[name='email']")
      );

      const passwordInputElement = <HTMLInputElement>(
        document.querySelector("[name='password']")
      );

      const passwordVerificationInputElement = <HTMLInputElement>(
        document.querySelector("[name='password-verification']")
      );

      const roleInputElement = <HTMLInputElement>(
        document.querySelector("[name='role']")
      );

      const user: IUser = {
        id: "",
        name: userNameInputElement.value,
        email: emailInputElement.value,
        password: passwordInputElement.value,
        passwordVerification: passwordVerificationInputElement.value,
        role: roleInputElement.value,
      };

      await this.userService.createUser(user);
      alert("Los datos fueron guardados");
      window.location.href = "/users";
    } catch (error) {
      errorHandler("No se pudo craer el usuario", error);
    }
  };

  private validateCreateUserForm() {
    let isFormValid = true;

    if (validateFieldRequired("user-name") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("email") === false) {
      isFormValid = false;
    }

    if (validateFieldRequired("password") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("password-verification") === false) {
      isFormValid = false;
    }

    if (
      validateFieldDependentEqual("password-verification", "password") === false
    ) {
      isFormValid = false;
    }

    if (validateFieldRequired("role") === false) {
      isFormValid = false;
    }
    return isFormValid;
  }
}
const createUserCtrl = new CreateUserController(new UserService());
