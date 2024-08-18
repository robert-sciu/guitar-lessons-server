const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  destructureData,
} = require("../../utilities/controllerUtilites");
const { Calendar } = require("../../models").sequelize.models;

const logger = require("../../utilities/logger");
const { integerToTime } = require("../../utilities/validatorsUtilities");

async function createCalendarEntry(req, res) {
  const data = destructureData(req.body, [
    "weekday",
    "date",
    "availability_from",
    "availability_to",
  ]);
  if (data.weekday) {
    data.is_permanent = true;
  } else if (data.date) {
    data.is_permanent = false;
  }
  const { availability_from, availability_to } = data;
  if (availability_from > availability_to) {
    return handleErrorResponse(
      res,
      400,
      "Availability start cannot be greater to availability end"
    );
  }
  data.availability_from = integerToTime(availability_from);
  data.availability_to = integerToTime(availability_to);
  if (availability_from === availability_to) {
    data.is_unavailable = true;
  }
  try {
    await createRecord(Calendar, data);
    return handleSuccessResponse(
      res,
      201,
      "Calendar entry created successfully"
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createCalendarEntry;
