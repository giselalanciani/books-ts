import { ICredential, IToken } from "../../models/login";
import { UserService } from "../../services/users-service";
import { configureValidator } from "../../utils/configureValidator";
import { errorHandler } from "../../utils/error-handler";
import { validateFieldEmail } from "../../utils/validateFieldEmail";
import { validateFieldRequired } from "../../utils/validateFieldRequired";

class LogInController {
  constructor(private userService: UserService) {
    const signInFormElememnt = <HTMLFormElement>(
      document.querySelector("[name='log-in-form']")
    );
    signInFormElememnt.addEventListener("submit", this.onSubmitForm);

    configureValidator("email", [{ type: "required" }]);
    configureValidator("password", [{ type: "required" }]);

    /** harcoded values on the FORM */
    const emailInputElement = <HTMLInputElement>(
      document.querySelector("[name='email']")
    );
    emailInputElement.value = "giselalanciani@gmail.com";
    const passwordInputElement = <HTMLInputElement>(
      document.querySelector("[name='password']")
    );
    passwordInputElement.value = "1233456";
  }

  private onSubmitForm = async (event: Event) => {
    event.preventDefault();
    if (this.validateLogInForm() === true) {
      const emailInputElement = <HTMLInputElement>(
        document.querySelector("[name='email']")
      );

      const passwordInputElement = <HTMLInputElement>(
        document.querySelector("[name='password']")
      );
      try {
        const credentials: ICredential = {
          email: emailInputElement.value,
          password: passwordInputElement.value,
        };
        const token = await this.userService.logIn(credentials);
      } catch (error) {
        errorHandler("No se pudo hacer login", error);
      }
    }
  };

  private validateLogInForm() {
    let isFormValid = true;
    if (validateFieldEmail("email") === false) {
      isFormValid = false;
    }
    if (validateFieldRequired("password") === false) {
      isFormValid = false;
    }
    return isFormValid;
  }
}
const logInCtrl = new LogInController(new UserService());
