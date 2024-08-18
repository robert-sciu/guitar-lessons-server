const {
  findRecordByPk,
  handleErrorResponse,
  deleteRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const { Calendar } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function deleteCalendarEntry(req, res) {
  const id = req.query.id;
  try {
    if (!(await findRecordByPk(Calendar, id))) {
      return handleErrorResponse(res, 404, "Calendar entry not found");
    }
    await deleteRecord(Calendar, id);
    return handleSuccessResponse(
      res,
      200,
      "Calendar entry deleted successfully"
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteCalendarEntry;
