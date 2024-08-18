const {
  updateRecord,
  destructureData,
  unchangedDataToUndefined,
  checkMissingUpdateData,
} = require("../../utilities/controllerUtilites");
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const { Calendar } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");
const {
  timeToInteger,
  integerToTime,
} = require("../../utilities/validatorsUtilities");

async function updateCalendarEntry(req, res) {
  const updateData = destructureData(req.body, [
    "weekday",
    "date",
    "availability_from",
    "availability_to",
  ]);

  const id = req.query.id;

  if (updateData.weekday) {
    updateData.is_permanent = true;
  } else if (updateData.date) {
    updateData.is_permanent = false;
  }
  try {
    const entry = await findRecordByPk(Calendar, id);
    if (!entry) {
      return handleErrorResponse(res, 404, "Calendar entry not found");
    }
    if (!updateData.availability_from) {
      updateData.availability_from = timeToInteger(entry.availability_from);
    }
    if (!updateData.availability_to) {
      updateData.availability_to = timeToInteger(entry.availability_to);
    }
    const { availability_from, availability_to } = updateData;
    if (availability_from > availability_to) {
      return handleErrorResponse(
        res,
        400,
        "Availability start cannot be greater to availability end"
      );
    }
    if (availability_from === availability_to) {
      updateData.is_unavailable = true;
    }
    updateData.availability_from = integerToTime(availability_from);
    updateData.availability_to = integerToTime(availability_to);
    const updateDataNoDuplicates = unchangedDataToUndefined(entry, updateData);
    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(res, 400, "No update data provided");
    }
    const updatedRowsCount = await updateRecord(
      Calendar,
      updateDataNoDuplicates,
      id
    );
    if (updatedRowsCount === 0) {
      return handleErrorResponse(res, 409, "Calendar entry not updated");
    }
    return handleSuccessResponse(
      res,
      201,
      "Calendar entry updated successfully"
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateCalendarEntry;
