const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const logger = require("../../utilities/logger");
const lessonReservationsService = require("./lessonReservationsService");
const planInfoService = require("../planInfo/planInfoService");
const responses = require("../../responses");

async function updateLessonReservation(req, res) {
  const language = req.language;
  const user = req.user;
  const user_id = user.id;
  const reservation_id = req.id;
  const updateTimeData =
    lessonReservationsService.destructureUpdateReservationData(req.body);

  try {
    const planInfo = await planInfoService.getPlanInfo(user.id);

    if (planInfo.reschedules_left_count <= 0) {
      return handleErrorResponse(
        res,
        400,
        responses.lessonReservationsMessages.noReschedulesLeft[language]
      );
    }

    const reservation = await lessonReservationsService.getReservationById(
      reservation_id
    );
    if (!reservation) {
      return handleErrorResponse(
        res,
        404,
        responses.lessonReservationsMessages.reservationNotFound[language]
      );
    }
    if (
      reservation.user_id !== user.id &&
      !lessonReservationsService.userIsAdmin(user)
    ) {
      return handleErrorResponse(
        res,
        403,
        responses.commonMessages.forbidden[language]
      );
    }

    const updateData = {
      id: reservation_id,
      ...updateTimeData,
      user_id,
      username: user.username,
      rescheduled_by_user: lessonReservationsService.userIsUser(user),
      rescheduled_by_admin: lessonReservationsService.userIsAdmin(user),
    };

    const { error, errorMsg } =
      await lessonReservationsService.veryfyReservationData(updateData);
    if (error) {
      return handleErrorResponse(res, 409, errorMsg[language]);
    }

    await lessonReservationsService.updateReschedulesLeftCount(user_id);

    await lessonReservationsService.rescheduleReservation(
      updateData,
      reservation_id
    );

    return handleSuccessResponse(
      res,
      200,
      responses.commonMessages.updateSuccess[language]
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = updateLessonReservation;
