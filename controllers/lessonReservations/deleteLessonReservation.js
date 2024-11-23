const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const lessonReservationsService = require("./lessonReservationsService");
const responses = require("../../responses");

async function deleteLessonReservation(req, res) {
  const language = req.language;
  const reservation_id = req.id;
  const user = req.user;
  const user_id = user.id;

  try {
    const lessonReservation =
      await lessonReservationsService.findReservationById(reservation_id);

    console.log(lessonReservation);
    if (!lessonReservation) {
      return handleErrorResponse(
        res,
        404,
        responses.lessonReservationsMessages.reservationNotFound[language]
      );
    }
    if (lessonReservation.user_id !== user_id) {
      return handleErrorResponse(
        res,
        403,
        responses.commonMessages.forbidden[language]
      );
    }
    if (
      lessonReservation.is_permanent &&
      !lessonReservationsService.userIsAdmin(user)
    ) {
      return handleErrorResponse(
        res,
        400,
        responses.lessonReservationsMessages.cannotDeletePermanentReservation[
          language
        ]
      );
    }

    await lessonReservationsService.updateCancelledReservationsCount(user_id);

    await lessonReservationsService.deleteReservation(reservation_id);
    return handleSuccessResponse(
      res,
      200,
      responses.lessonReservationsMessages.reservationDeleted[language]
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

module.exports = deleteLessonReservation;
