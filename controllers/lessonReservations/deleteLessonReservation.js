const {
  findRecordByPk,
  handleErrorResponse,
  deleteRecord,
  handleSuccessResponse,
  findRecordByFk,
  updateRecord,
} = require("../../utilities/controllerUtilites");
const { LessonReservation } = require("../../models");
const logger = require("../../utilities/logger");
const { PlanInfo } = require("../../models").sequelize.models;

async function deleteLessonReservation(req, res) {
  const id = req.params.id;
  const user = req.user;

  try {
    const lessonReservation = await findRecordByPk(LessonReservation, id);
    if (!lessonReservation) {
      return handleErrorResponse(res, 404, "Lesson reservation not found");
    }
    if (lessonReservation.user_id !== user.id) {
      return handleErrorResponse(res, 403, "Forbidden");
    }
    if (lessonReservation.is_permanent) {
      return handleErrorResponse(
        res,
        400,
        "Cannot delete permanent reservation, you need to update Plan Info instead"
      );
    }
    const planInfo = await findRecordByFk(PlanInfo, user.id);

    const cancelled_lesson_count = planInfo.cancelled_lesson_count + 1;
    await updateRecord(PlanInfo, { cancelled_lesson_count }, user.id);

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
