const {
  findRecordByFk,
  handleErrorResponse,
  handleSuccessResponse,
  updateRecord,
} = require("../../utilities/controllerUtilites");
const { UserTask } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function updateUserTask(req, res) {
  const { user_id, task_id, is_completed } = req.body;
  try {
    const userTask = await findRecordByFk(UserTask, { user_id, task_id });
    if (!userTask) {
      return handleErrorResponse(res, 404, "User task not found");
    }
    if (String(userTask.is_completed) === String(is_completed)) {
      return handleErrorResponse(res, 409, "Cannot update to same value");
    }
    const updatedRecordCount = await updateRecord(
      UserTask,
      { is_completed },
      userTask.id
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(res, 409, "User task not updated");
    }
    return handleSuccessResponse(res, 200, "User task updated successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateUserTask;
