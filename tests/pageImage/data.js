const createPageImageData = {
  valid: {
    title: "Test Title",
    section: "hero",
    category: "main",
    position: 1,
    size_on_page: "large",
  },
  validUpdate: {
    title: "Test Title Update",
    section: "about",
    category: "secondary",
    position: 2,
    size_on_page: "medium",
  },
  invalid: {
    titleList: ["", 0, 2, "123", NaN, true, false],
    sectionList: ["", 0, 2, "123", NaN, true, false],
    categoryList: [0, 2, "123", true, false],
    positionList: ["string", "", NaN, true, false],
    size_on_pageList: ["size", "", 0, 2, "123", NaN, true, false],
    queryParameterList: ["", "1n", NaN, "string", undefined, null],
  },
};

const expectedFilenamesForTestFile = {
  desktop: "desktop-test.webp",
  mobile: "mobile-test.webp",
  lazy: "lazy-test.webp",
};

module.exports = { createPageImageData, expectedFilenamesForTestFile };
