const createTaskTagData = {
  valid: {
    task_id: 1,
    tag_id: 1,
  },
  invalidIdList: ["", undefined, null, 0, NaN, "string", true, false],
};

const deleteTaskTagData = {
  valid: {
    task_id: 1,
    tag_id: 1,
  },
  invalidIdList: ["", undefined, null, 0, NaN, "string", true, false],
};

const getTaskTagData = {
  invalidDifficultyClearanceList: [
    "",
    undefined,
    null,
    NaN,
    "string",
    true,
    false,
  ],
};

module.exports = {
  createTaskTagData,
  deleteTaskTagData,
  getTaskTagData,
};
