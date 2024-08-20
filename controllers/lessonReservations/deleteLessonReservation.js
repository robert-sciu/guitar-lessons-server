const {
  findRecordByPk,
  handleErrorResponse,
  deleteRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const { LessonReservation } = require("../../models");
const logger = require("../../utilities/logger");

async function deleteLessonReservation(req, res) {
  const id = req.query.id;
  try {
    if (!(await findRecordByPk(LessonReservation, id))) {
      return handleErrorResponse(res, 404, "Lesson reservation not found");
    }
    await deleteRecord(LessonReservation, id);
    return handleSuccessResponse(
      res,
      200,
      "Lesson reservation deleted successfully"
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteLessonReservation;
