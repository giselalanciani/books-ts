const validateFieldEmail = (fieldName: string) => {
  const inputFieldElement = <HTMLInputElement>(
    document.querySelector(`[name='${fieldName}']`)
  );
  const inputFieldEmailErrorElement = document.querySelector(
    `[name='${fieldName}-email']`
  );

  const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  if (inputFieldElement?.value !== '' && regexp.test(inputFieldElement?.value) === false) {
    inputFieldEmailErrorElement?.classList.remove("hidden");
    return false;
  }
  inputFieldEmailErrorElement?.classList.add("hidden");
  return true;
};
export { validateFieldEmail };
