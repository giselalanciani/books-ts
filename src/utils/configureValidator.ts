import { validateFieldDependentEqual } from "./validateFieldDependentEqual";
import { validateFieldNumeric } from "./validateFieldNumeric";
import { validateFieldRequired } from "./validateFieldRequired";

interface IValidatorConfig {
  type: string;
  config?: any;
}

const configureValidator: (
  fieldName: string,
  listOfValidator?: IValidatorConfig[]
) => void = (fieldName: string, listOfValidator = [{ type: "required" }]) => {
  const inputElement = <HTMLInputElement>(
    document.querySelector(`[name='${fieldName}']`)
  );

  listOfValidator.forEach((validatorConfig) => {
    switch (validatorConfig.type) {
      case "required":
        inputElement.addEventListener("change", (event: Event) => {
          const fieldInputElement = <HTMLInputElement>event.target;
          const nameElement = fieldInputElement.getAttribute("name");

          if (nameElement !== null) {
            validateFieldRequired(nameElement);
          }
        });
        break;
      case "numeric":
        inputElement.addEventListener("change", (event: Event) => {
          const fieldInputElement = <HTMLInputElement>event.target;
          const name = fieldInputElement.getAttribute("name");

          if (name !== null) {
            validateFieldNumeric(name);
          }
        });
        break;
      case "dependent-equal":
        inputElement.addEventListener("change", (event: Event) => {
          const fieldInputElement = <HTMLInputElement>event.target;
          const name = fieldInputElement.getAttribute("name");

          if (name !== null) {
            validateFieldDependentEqual(
              name,
              validatorConfig.config.dependentFieldName
            );
          }
        });
        break;
    }
  });
};

export { configureValidator };
