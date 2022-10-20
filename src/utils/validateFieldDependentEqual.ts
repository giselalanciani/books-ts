const validateFieldDependentEqual = (
  fieldName: string,
  dependentFieldName: string
) => {
  const inputElement = <HTMLInputElement>(
    document.querySelector(`[name='${fieldName}']`)
  );

  const dependentInputElement = <HTMLInputElement>(
    document.querySelector(`[name='${dependentFieldName}']`)
  );

  const dependentEqualError = <HTMLSelectElement>(
    document.querySelector(`[name='${fieldName}-dependent-equal']`)
  );

  if (inputElement.value == dependentInputElement.value) {
    dependentEqualError.classList.add("hidden");
    return true;
  } else {
    dependentEqualError.classList.remove("hidden");
    return false;
  }   
};

export { validateFieldDependentEqual };
