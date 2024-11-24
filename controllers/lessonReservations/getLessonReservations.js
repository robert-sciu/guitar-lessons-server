const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const responses = require("../../responses");
const lessonReservationsService = require("./lessonReservationsService");

async function getLessonReservations(req, res) {
  const language = req.language;
  try {
    const lessonReservations =
      await lessonReservationsService.getAllReservations();
    return handleSuccessResponse(res, 200, lessonReservations);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getLessonReservations;
