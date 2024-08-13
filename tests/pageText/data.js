const pageTextData = {
  valid: {
    section: "hero",
    category: "main",
    position: 1,
    content_pl: "test pl",
    content_en: "test en",
  },
  validUpdate: {
    category: "secondary",
    position: 2,
    content_pl: "update pl",
    content_en: "update en",
  },

  invalid: {
    sectionList: ["", null, undefined, 0, NaN, 2],
    categoryList: [1, NaN, 2, null],
    positionList: [NaN, "string"],
    contentList: ["", 1, NaN, 2, undefined, null],
    queryParameterList: ["", "1n", NaN, "string", undefined, null],
  },
};

module.exports = { pageTextData };
