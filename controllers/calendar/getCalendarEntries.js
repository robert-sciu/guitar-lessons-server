const {
  findAllRecords,
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const { Calendar } = require("../../models").sequelize.models;

const logger = require("../../utilities/logger");

async function getCalendarEntries(req, res) {
  const id = req.query.id;
  if (id) {
    const entry = await findRecordByPk(Calendar, id);
    if (!entry) {
      return handleErrorResponse(res, 404, "Calendar entry not found");
    }
    return handleSuccessResponse(res, 200, entry);
  }
  const entries = await findAllRecords(Calendar);
  if (entries.length < 1) {
    return handleErrorResponse(res, 404, "No calendar entries found");
  }
  return handleSuccessResponse(res, 200, entries);
}
module.exports = getCalendarEntries;
