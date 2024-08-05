const { UserTask } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  deleteRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function deleteUserTask(req, res, next) {
  const id = req.query.id;
  try {
    if (!(await findRecordByPk(UserTask, id))) {
      return handleErrorResponse(res, 404, "User task not found");
    }
    await deleteRecord(UserTask, id);
    return handleSuccessResponse(res, 200, "User task deleted successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteUserTask;
