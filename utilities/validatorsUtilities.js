function formatValidationErrors(errors, language = "en") {
  const firstError = errors.map((error) => {
    return `${error.msg[language]}`;
  })[0];
  return firstError;
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
      restult[key] = noValuesToUndefined(value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

function customNotEmpty() {
  return (value) => {
    const checkedValue = noValuesToUndefined({ value });
    if (checkedValue.value === undefined) {
      throw new Error("Value is required");
    }
    return true;
  };
}

function integerToTime(int) {
  const time = `${int}:00:00`;
  return time;
}

function timeToInteger(time) {
  const int = parseInt(time.split(":")[0]);
  return int;
}

function detectUnnecessaryData(req) {
  if (
    Object.keys(req.query).length > 0 ||
    Object.keys(req.params).length > 0 ||
    Object.keys(req.body).length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
  integerToTime,
  timeToInteger,
  detectUnnecessaryData,
};
