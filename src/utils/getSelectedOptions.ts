const getSelectValues = (select: HTMLSelectElement) => {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value);
    }
  }
  return result;
};

const setSelectValues = (select: HTMLSelectElement, values: string[]) => {
  var options = select && select.options;
  var opt;

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];
    if (findValue(values, opt.value) === true) {      
      opt.selected = true;
    }
  }
};

const findValue = (values: string[], value: string): boolean => {
  for(let i = 0; i <= values.length; i++){
    if (values[i] === value) {
      return true;
    }
  }
  return false;
};

export { getSelectValues, setSelectValues };
