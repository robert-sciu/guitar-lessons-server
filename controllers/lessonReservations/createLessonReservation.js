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
  const timeData = req.body;
  // TODO: get detected user timezone from headers
  const userTimezone = "Europe/Warsaw";

  // these are the start and end times of the reservation in UTC iso strings.
  const { start_UTC, end_UTC } =
    lessonReservationsService.getStartAndEndUTCMomentIsoStrings(
      {
        timeData,
      },
      userTimezone
    );

  const data = {
    user_id: user.id,
    username: user.username,
    start_UTC,
    end_UTC,
    duration: timeData.duration,
    is_permanent: false,
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
