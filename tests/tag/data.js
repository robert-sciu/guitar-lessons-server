const createTagData = {
  valid: {
    category: "instrument",
    value: "guitar",
  },
  validUpdate: {
    category: "genre",
    value: "metal",
  },
  invalidCategoryList: [
    "",
    undefined,
    null,
    0,
    NaN,
    "noSuchCategory",
    true,
    false,
  ],
  invalidValueList: ["", undefined, null, 0, NaN, true, false],
  invalidQueryList: ["", undefined, null, 0, NaN, true, false],
  invalidGetQueryList: ["", "one", null, 0, NaN, true, false],
  invalidCategoryUpdateList: [null, 0, NaN, true, false, "noSuchCategory"],
  invalidValueUpdateList: [null, 0, NaN, true, false],
};

module.exports = { createTagData };
