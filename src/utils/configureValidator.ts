import { validateFieldNumeric } from "./validateFieldNumeric";
import { validateFieldRequired } from "./validateFieldRequired";

const configureValidator = (
  fieldName: string,
  listOfValidator = ["required"]
) => {
  const inputElement = <HTMLInputElement>(
    document.querySelector(`[name='${fieldName}']`)
  );

  listOfValidator.forEach((validatorName) => {
    switch (validatorName) {
      case "required":
        inputElement.addEventListener("change", (event: Event) => {
          const name = (<HTMLInputElement>event.target).getAttribute("name");
          if (name !== null) {
            validateFieldRequired(name);
          }
        });
        break;
      case "numeric":
        inputElement.addEventListener("change", (event: Event) => {
          const name = (<HTMLInputElement>event.target).getAttribute("name");
          if (name !== null) {
            validateFieldNumeric("name");
          }
        });
        break;
    }
  });
};

export { configureValidator };
