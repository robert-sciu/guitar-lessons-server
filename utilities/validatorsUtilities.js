function formatValidationErrors(errors) {
  return errors.map((error) => {
    if (error.msg === "Invalid value") return;
    return `${error.msg}`;
  });
}

function noValuesToUndefined(input) {
  if (typeof input !== "object") return;
  const result = {};
  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (
      value === "" ||
      value === null ||
      value === "null" ||
      value === undefined ||
      value === "undefined" ||
      value === NaN ||
      value === "NaN"
    ) {
      result[key] = undefined;
    } else if (typeof value === "string" && value.trim() === "") {
      result[key] = undefined;
    } else if (typeof value === "number" && isNaN(value)) {
      result[key] = undefined;
    } else if (typeof value === "object") {
      noValuesToUndefined(value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

function customNotEmpty() {
  return (value) => {
    const checkedValue = noValuesToUndefined({ value });
    if (!checkedValue.value) {
      throw new Error("Value is required");
    }
    return true;
  };
}

module.exports = {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
};
