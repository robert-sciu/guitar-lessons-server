const { LessonReservation, User, PlanInfo } =
  require("../../models/").sequelize.models;
const {
  destructureData,
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  findAllRecords,
  updateRecord,
  findRecordByFk,
} = require("../../utilities/controllerUtilites");
const {
  checkIfReservationDateIsAllowed,
  checkForOverlapingReservations,
} = require("../../utilities/lessonReservationControllerUtilities");

const logger = require("../../utilities/logger");
const {
  reservationsOverlap,
} = require("../../utilities/planInfoControllerUtilities");

async function updateLessonReservation(req, res) {
  const user = req.user;
  const data = destructureData(req.body, [
    "oldReservation",
    "newDate",
    "newHour",
    "newMinute",
  ]);

  const reservation = await findRecordByPk(
    LessonReservation,
    data.oldReservation.id
  );

  const planInfo = await findRecordByFk(PlanInfo, user.id);

  if (planInfo.reschedules_left_count <= 0) {
    return handleErrorResponse(
      res,
      400,
      "You've already rescheduled too many times"
    );
  }

  if (!reservation) {
    return handleErrorResponse(res, 404, "Reservation not found");
  }
  if (reservation.user_id !== user.id) {
    return handleErrorResponse(res, 403, "Forbidden");
  }

  const newReservation = {
    ...data.oldReservation,
    date: data.newDate,
    hour: data.newHour,
    minute: data.newMinute,
    rescheduled_by_user: user.role === "user" ? true : false,
    rescheduled_by_admin: user.role === "admin" ? true : false,
  };
  const { error: dateError, errorMsg: dateErrorMsg } =
    checkIfReservationDateIsAllowed(newReservation.date);
  if (dateError) {
    return handleErrorResponse(res, 400, dateErrorMsg);
  }

  const { error: conflictError, errorMsg: conflictErrorMsg } =
    await checkForOverlapingReservations(newReservation);

  if (conflictError) {
    return handleErrorResponse(res, 409, conflictErrorMsg);
  }
  await updateRecord(
    PlanInfo,
    {
      reschedules_left_count: planInfo.reschedules_left_count - 1,
    },
    user.id
  );

  await updateRecord(LessonReservation, newReservation, data.oldReservation.id);
  const updatedRecord = await findRecordByPk(
    LessonReservation,
    data.oldReservation.id
  );

  updatedRecord.dataValues["previousDate"] = data.oldReservation.date;

  return handleSuccessResponse(res, 200, updatedRecord);
}

module.exports = updateLessonReservation;
