const { PlanInfo } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  findRecordByFk,
  updateRecord,
  handleSuccessResponse,
  removeEmptyValues,
  destructureData,
} = require("../../utilities/controllerUtilites");

async function updatePlanInfo(req, res) {
  const updateData = destructureData(req.body, [
    "has_permanent_reservation",
    "permanent_reservation_weekday",
    "permanent_reservation_hour",
    "permanent_reservation_minute",
    "permanent_reservation_lesson_length",
    "permanent_reservation_lesson_count",
    "regular_discount",
    "permanent_discount",
  ]);
  const { user_id } = req.body;
  const filteredUpdateData = removeEmptyValues(updateData);
  if (checkMissingUpdateData(updateData)) {
    return handleErrorResponse(res, 400, "No update data provided");
  }
  try {
    const planInfo = await findRecordByFk(PlanInfo, user_id);
    if (!planInfo) {
      return handleErrorResponse(res, 404, "Plan info not found");
    }
    const updateRowsCount = updateRecord(PlanInfo, filteredUpdateData, user_id);
    if (updateRowsCount === 0) {
      return handleErrorResponse(res, 409, "Update failed");
    }
    return handleSuccessResponse(res, 200, "Plan info updated successfully");
  } catch (error) {
    logger.error(error);
    handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updatePlanInfo;
