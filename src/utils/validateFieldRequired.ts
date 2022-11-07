const validateFieldRequired = (fieldName: string) => {
  const inputElement = <HTMLInputElement>(
    document.querySelector(`[name='${fieldName}']`)
  );
  const requiredErrorDivElement = document.querySelector(
    `[name='${fieldName}-required']`
  );

  if (inputElement?.value == "") {    
    if (inputElement?.classList.contains("is-invalid") === false) {
      inputElement?.classList.add("is-invalid");
    }
    
    requiredErrorDivElement?.classList.remove("hidden");
    return false;
  }
  if (inputElement?.classList.contains("is-invalid") === true) {
    // inputElement?.classList.remove("is-invalid");
  }
  requiredErrorDivElement?.classList.add("hidden");
  return true;
};

export { validateFieldRequired };
