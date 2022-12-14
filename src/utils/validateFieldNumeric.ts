/**
 * this function check if an object is a number or not
 * @param str any
 * @returns boolean
 */
function isNumeric(str: any) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    //@ts-ignore
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const validateFieldNumeric = (fieldName: string) => {
  const input = <HTMLInputElement>(
    document.querySelector(`[name='${fieldName}']`)
  );
  const numericError = <HTMLSelectElement>(
    document.querySelector(`[name='${fieldName}-numeric']`)
  );

  if (input.value == "") {
    if (input?.classList.contains("is-invalid") === true) {
      // input.classList.remove("is-invalid");
    }
    numericError.classList.add("hidden");
    return true;
  } else if (isNumeric(input.value) === false) {
    if (input?.classList.contains("is-invalid") === false) {
      input.classList.add("is-invalid");
    }    
    numericError.classList.remove("hidden");
    return false;
  } else {
    if (input?.classList.contains("is-invalid") === true) {
      // input.classList.remove("is-invalid");
    }
    numericError.classList.add("hidden");
    return true;
  }
};

export { validateFieldNumeric };
