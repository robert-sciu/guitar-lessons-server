const { User, Task, UserTask } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  findRecordByFk,
  createRecord,
  handleSuccessResponse,
  destructureData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function createUserTask(req, res) {
  const data = destructureData(req.body, ["user_id", "task_id", "user_notes"]);
  const { user_id, task_id } = data;
  try {
    if (!(await findRecordByPk(User, user_id))) {
      return handleErrorResponse(res, 404, "User not found");
    }
    if (!(await findRecordByPk(Task, task_id))) {
      return handleErrorResponse(res, 404, "Task not found");
    }
    if (await findRecordByFk(UserTask, { user_id, task_id })) {
      return handleErrorResponse(res, 409, "User task already exists");
    }
    await createRecord(UserTask, {
      ...data,
    });

    return handleSuccessResponse(res, 201, "User task created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createUserTask;
