const createUserTaskData = {
  valid: {
    user_id: 1,
    task_id: 1,
    user_notes: "Test",
  },
  invalid: {
    userIdList: ["", undefined, null, 0, NaN, "string", true, false],
    taskIdList: ["", undefined, null, 0, NaN, "string", true, false],
  },
  validUserNotesList: ["", "Test", undefined],
  invalidQueryList: ["", undefined, null, 0, NaN, "string", true, false],
};

module.exports = {
  createUserTaskData,
};
