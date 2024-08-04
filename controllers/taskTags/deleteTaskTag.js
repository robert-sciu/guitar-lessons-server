const { TaskTag } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  deleteRecord,
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function deleteTaskTag(req, res) {
  const id = req.query.id;
  try {
    if (!(await findRecordByPk(TaskTag, id))) {
      return handleErrorResponse(res, 404, "Task tag not found");
    }
    await deleteRecord(TaskTag, id);
    return handleSuccessResponse(res, 200, "Task tag deleted successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteTaskTag;
