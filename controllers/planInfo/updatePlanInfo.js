const { PlanInfo } = require("../../models").sequelize.models;
const { Op } = require("sequelize");
const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  findRecordByFk,
  updateRecord,
  handleSuccessResponse,
  destructureData,
  unchangedDataToUndefined,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const {
  planInfoOverlap,
} = require("../../utilities/planInfoControllerUtilities");

async function updatePlanInfo(req, res) {
  const user_id = req.query.user_id;
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

  try {
    const planInfo = await findRecordByFk(PlanInfo, user_id);
    if (!planInfo) {
      return handleErrorResponse(res, 404, "Plan info not found");
    }
    const otherPlanInfos = await findAllRecords(PlanInfo, {
      user_id: { [Op.ne]: user_id },
    });
    if (otherPlanInfos.length === 0) return;
    const conflicts = [];
    otherPlanInfos.forEach(async (planInfo) => {
      if (
        planInfo.permanent_reservation_weekday !==
        updateData.permanent_reservation_weekday
      ) {
        return;
      }
      if (planInfoOverlap(updateData, planInfo)) {
        conflicts.push(planInfo.user_id);
      }
    });
    if (conflicts.length > 0) {
      return handleErrorResponse(
        res,
        409,
        `Plan info conflicts with user ${conflicts.join(", ")}`
      );
    }
    const updateDataNoDuplicates = unchangedDataToUndefined(
      planInfo,
      updateData
    );
    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(res, 400, "No update data provided");
    }
    const updateRowsCount = updateRecord(PlanInfo, updateData, user_id);
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
