const { Task, Tag, TaskTag } = require("../../models").sequelize.models;
const {
  handleErrorResponse,
  createRecord,
  handleSuccessResponse,
  findRecordByPk,
  findRecordByFk,
  destructureData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function createTaskTag(req, res) {
  const data = destructureData(req.body, ["task_id", "tag_id"]);
  const { task_id, tag_id } = data;
  try {
    const task = await findRecordByPk(Task, task_id);
    if (!task) {
      return handleErrorResponse(res, 404, "Task not found");
    }
    const taskDifficultyLevel = task.difficulty_level;
    if (!(await findRecordByPk(Tag, tag_id))) {
      return handleErrorResponse(res, 404, "Tag not found");
    }

    if (await findRecordByFk(TaskTag, { task_id, tag_id })) {
      return handleErrorResponse(res, 409, "Task tag already exists");
    }
    await createRecord(TaskTag, {
      task_id,
      tag_id,
      task_difficulty_level: taskDifficultyLevel,
    });
    return handleSuccessResponse(res, 201, "Task tag created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createTaskTag;
