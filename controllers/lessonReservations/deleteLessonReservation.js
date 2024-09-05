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
    const lessonReservation = await findRecordByPk(LessonReservation, id);
    if (!lessonReservation) {
      return handleErrorResponse(res, 404, "Lesson reservation not found");
    }
    if (lessonReservation.is_permanent) {
      return handleErrorResponse(
        res,
        400,
        "Cannot delete permanent reservation, you need to update Plan Info instead"
      );
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
