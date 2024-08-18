const createYouTubeVideoData = {
  valid: {
    title: "Test title",
    section: "hero",
    url: "https://www.youtube.com/watch?v=1234567890",
    category: "main",
    position: 0,
    user_id: 1,
  },
  validUpdate: {
    title: "Test title update",
    section: "about",
    url: "https://www.youtube.com/watch?v=12345678901",
    category: "secondary",
    position: 1,
    user_id: 1,
  },
  invalid: {
    titleList: ["", 0, 2, "123", NaN, true, false, undefined, null],
    titleUpdateList: [0, 2, "123", NaN, true, false, null],
    sectionList: ["", 0, 2, "123", NaN, true, false, undefined, null],
    urlList: [
      "",
      0,
      2,
      "123",
      NaN,
      true,
      false,
      undefined,
      null,
      "string",
      "htt://www.youtube.com/watch?v=1234567890",
      "wwwyoutubecom/watch?v=1234567890",
    ],
    categoryList: ["", 0, 2, "123", NaN, true, false],
    positionList: ["string", "", NaN, true, false],
    user_idList: ["string", "", NaN, true, false],
    queryParameterList: ["", "1n", NaN, "string", undefined, null],
  },
};

module.exports = { createYouTubeVideoData };
