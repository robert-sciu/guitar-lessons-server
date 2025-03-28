const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const lessonReservationsService = require("./lessonReservationsService");
const responses = require("../../responses");

const logger = require("../../utilities/logger");

async function createLessonReservation(req, res) {
  const language = req.language;
  const user = req.user;
  const reservationData =
    lessonReservationsService.destructureCreateReservationData(req.body);

  if (!user.is_active) {
    return handleErrorResponse(
      res,
      403,
      responses.lessonReservationsMessages.userNotConfirmed[language]
    );
  }

  const data = {
    ...reservationData,
    user_id: user.id,
    username: user.username,
    is_permanent: false,
    free_edit_expiry: lessonReservationsService.addMinutesToNow(60),
  };

  const { error, errorMsg } =
    await lessonReservationsService.veryfyReservationData(data);
  if (error) {
    return handleErrorResponse(res, 409, errorMsg[language]);
  }
  try {
    const createdRecord = await lessonReservationsService.createReservation(
      data
    );
    return handleSuccessResponse(res, 201, createdRecord);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = createLessonReservation;
