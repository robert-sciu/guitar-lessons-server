const {
  findAllRecords,
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const { LessonReservation } = require("../../models").sequelize.models;

async function getLessonReservations(req, res) {
  const id = req.query.user_id;
  try {
    const lessonReservations = await findAllRecords(LessonReservation);
    return handleSuccessResponse(res, 200, lessonReservations);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getLessonReservations;
