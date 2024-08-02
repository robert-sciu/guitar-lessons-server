function filterURL(url) {
  return url.replace("https://", "").replace("http://", "").replace("www.", "");
}

function noValuesToUndefined(obj) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === "string" && value.trim() === "") {
      req.body[key] = undefined;
    }

    if (typeof obj[key] === "object") {
      noValuesToUndefined(obj[key]);
    }

    if (value === null) {
      req.body[key] = undefined;
    }

    if (typeof value === "number" && isNaN(value)) {
      req.body[key] = undefined;
    }
  });

  return obj;
}

module.exports = { filterURL, noValuesToUndefined };
