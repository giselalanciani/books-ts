import { ICredential, IToken } from "../../models/login";
import { UserService } from "../../services/users-service";

class LogInController {
  constructor(private userService: UserService) {
    const signInButton = <HTMLButtonElement>(
      document.getElementById("sign-In-button")
    );
    signInButton.addEventListener("click", this.onClicksignInButton);

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

  private onClicksignInButton = async () => {
    const emailInputElement = <HTMLInputElement>(
      document.querySelector("[name='email']")
    );

    const passwordInputElement = <HTMLInputElement>(
      document.querySelector("[name='password']")
    );

    const credentials: ICredential = {
      email: emailInputElement.value,
      password: passwordInputElement.value,
    };

    const token = await this.userService.logIn(credentials);
    console.log("token", token);
  };
}
const logInCtrl = new LogInController(new UserService());
