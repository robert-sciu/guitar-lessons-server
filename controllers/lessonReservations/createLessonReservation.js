const { LessonReservation, User } = require("../../models/LessonReservation")
  .sequelize.models.LessonReservation;
const {
  destructureData,
  findRecordByPk,
  handleErrorResponse,
  createRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const logger = require("../../utilities/logger");

async function createLessonReservation(req, res) {
  const data = destructureData(req.body, ["user_id", "date", "time"]);

  try {
    const user = findRecordByPk(User, data.user_id);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }
    data = { ...data, username: user.username };
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
