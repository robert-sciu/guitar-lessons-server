const { User, Task, UserTask } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  findRecordByFk,
  createRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function createUserTask(req, res) {
  const { user_id, task_id, user_notes } = req.body;
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
      user_id,
      task_id,
      user_notes,
    });

    return handleSuccessResponse(res, 201, "User task created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createUserTask;
