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
  checkForOverlapingReservations,
} = require("../../utilities/lessonReservationControllerUtilities");

const logger = require("../../utilities/logger");

async function createLessonReservation(req, res) {
  const user = req.user;
  const data = destructureData(req.body, [
    "date",
    "hour",
    "minute",
    "duration",
  ]);
  data["user_id"] = user.id;
  data["username"] = user.username;
  data["is_permanent"] = false;

  const { error, errorMsg } = checkIfReservationDateIsAllowed(data.date);
  if (error) {
    return handleErrorResponse(res, 400, errorMsg);
  }

  const { error: conflictError, errorMsg: conflictErrorMsg } =
    await checkForOverlapingReservations(data);
  if (conflictError) {
    return handleErrorResponse(res, 409, conflictErrorMsg);
  }
  try {
    const createdRecord = await createRecord(LessonReservation, data);

    return handleSuccessResponse(res, 201, createdRecord);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createLessonReservation;
