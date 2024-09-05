const { LessonReservation, User } = require("../../models/").sequelize.models;
const {
  destructureData,
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  findAllRecords,
  createRecord,
} = require("../../utilities/controllerUtilites");

const logger = require("../../utilities/logger");
const {
  reservationsOverlap,
} = require("../../utilities/planInfoControllerUtilities");

async function createLessonReservation(req, res) {
  const data = destructureData(req.body, [
    "user_id",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "duration",
  ]);
  data["is_permanent"] = false;
  data["date"] = new Date(data.year, data.month - 1, data.day, 19, data.minute)
    .toISOString()
    .split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  if (data.date < today) {
    return handleErrorResponse(res, 400, "Date cannot be in the past");
  }
  if (data.date === today) {
    return handleErrorResponse(res, 400, "Date cannot be today");
  }
  if (new Date(today) + new Date(data.date) / 24 / 60 / 60 / 1000 >= 14) {
    return handleErrorResponse(
      res,
      400,
      "Date cannot be more than 14 days in the future"
    );
  }
  try {
    const user = await findRecordByPk(User, data.user_id);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const existingReservationsForDate = await findAllRecords(
      LessonReservation,
      {
        date: data.date,
      }
    );

    if (existingReservationsForDate.length > 0) {
      const conflicts = existingReservationsForDate.map((reservation) => {
        if (reservationsOverlap(data, reservation.dataValues)) {
          return reservation.dataValues.user_id;
        }
        return null;
      });
      if (conflicts.filter((conflict) => conflict !== null).length > 0) {
        return handleErrorResponse(
          res,
          409,
          `Reservation conflicts with existing reservation by users with ids: ${conflicts.join(
            ", "
          )}`
        );
      }
    }

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
