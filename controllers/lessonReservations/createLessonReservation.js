const { LessonReservation, User } = require("../../models/").sequelize.models;
const {
  destructureData,
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  findAllRecords,
  createRecord,
} = require("../../utilities/controllerUtilites");
const {
  checkIfReservationDateIsAllowed,
} = require("../../utilities/lessonReservationControllerUtilities");

const logger = require("../../utilities/logger");

async function createLessonReservation(req, res) {
  const user = req.user;
  const data = destructureData(req.body, [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "duration",
  ]);
  data["user_id"] = req.user.id;
  data["is_permanent"] = false;
  data["date"] = new Date(data.year, data.month - 1, data.day)
    .toISOString()
    .split("T")[0];
  const { error, errorMsg } = checkIfReservationDateIsAllowed(data.date);
  if (error) {
    return handleErrorResponse(res, 400, errorMsg);
  }
  try {
    await createRecord(LessonReservation, data);
    return handleSuccessResponse(
      res,
      201,
      "Lesson reservation created successfully"
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createLessonReservation;
