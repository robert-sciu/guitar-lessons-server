const createTaskData = {
  valid: {
    title: "Test Task 1",
    artist: "Test Artist",
    url: "https://example.com",
    notes_pl: "Notatka Testowa",
    notes_en: "Test Note",
    difficulty_level: 1,
  },
  validForUrlCheck: {
    title: "Test Task 1",
    url: "dummyurl",
    difficulty_level: 1,
  },
  validUrlList: [
    "https://example.com",
    "https://www.example.com",
    "example.com",
    "www.example.com",
  ],

  validFileOnly: {
    title: "Test Task 1",
    difficulty_level: 1,
  },
  invalidUrlList: [
    "",
    0,
    "12",
    undefined,
    null,
    true,
    false,
    NaN,
    "@email.com",
  ],
  invalidDifficultyLevelList: [
    "",
    "difficult",
    undefined,
    null,
    true,
    false,
    NaN,
  ],
  invalidTitleList: ["", 0, undefined, null, true, false, NaN],
  invalidQueryParameterList: ["", 0, "id", null, true, false, NaN],
};

const updateTaskData = {
  valid: {
    id: 1,
    title: "Test Task 2",
    artist: "Test Artist 2",
    url: "https://example2.com",
    notes_pl: "Notatka Testowa 2",
    notes_en: "Test Note 2",
    difficulty_level: 2,
  },
  invalidQueryParameterList: [0, "id", null, true, false, NaN],
  invalidTitleList: [0, "12", true, false],
  invalidDifficultyLevelList: ["difficult", true, false, NaN],
  invalidUrlList: [0, "12", true, false, NaN],
  invalidNotesList: [0, "12", true, false, NaN],
  invalidArtistList: [0, "12", true, false, NaN],
};

module.exports = {
  createTaskData,
  updateTaskData,
};
