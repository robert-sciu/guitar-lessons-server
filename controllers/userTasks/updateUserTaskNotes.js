const { UserTask } = require("../../models").sequelize.models;
const {
  findRecordByFk,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function updateUserTaskNotes(req, res, next) {
  const { user_id, task_id, user_notes } = req.body;
  try {
    const userTask = await findRecordByFk(UserTask, { user_id, task_id });
    if (!userTask) {
      return handleErrorResponse(res, 404, "User task not found");
    }
    const updatedRecordCount = await updateRecord(
      UserTask,
      { user_notes },
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

module.exports = updateUserTaskNotes;
