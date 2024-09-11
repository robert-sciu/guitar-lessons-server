const { UserTask } = require("../../models").sequelize.models;
const {
  findRecordByFk,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
  destructureData,
  findRecordByPk,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function updateUserTaskNotes(req, res, next) {
  const updateData = destructureData(req.body, ["id", "user_notes"]);
  updateData.user_id = req.user.id;
  const { id, user_id, user_notes = "" } = updateData;
  try {
    const userTask = await findRecordByPk(UserTask, id);

    if (!userTask || userTask.user_id !== user_id) {
      return handleErrorResponse(res, 404, "User task not found");
    }

    const updatedRecordCount = await updateRecord(UserTask, { user_notes }, id);
    if (updatedRecordCount === 0) {
      return handleErrorResponse(res, 409, "User task not updated");
    }
    const sendData = { id, user_notes };
    return handleSuccessResponse(res, 200, sendData);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateUserTaskNotes;
