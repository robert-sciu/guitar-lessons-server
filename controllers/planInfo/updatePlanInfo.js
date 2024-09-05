const { PlanInfo, LessonReservation } =
  require("../../models").sequelize.models;
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
  deleteRecord,
} = require("../../utilities/controllerUtilites");
const {
  planInfoOverlap,
} = require("../../utilities/planInfoControllerUtilities");
const syncAutomaticLessonReservations = require("../lessonReservations/syncAutomaticLessonReservations");
const config = require("../../config/config")[process.env.NODE_ENV];

async function updatePlanInfo(req, res) {
  const user_id = req.query.user_id;
  const updateData = destructureData(req.body, [
    "has_permanent_reservation",
    "permanent_reservation_weekday",
    "permanent_reservation_hour",
    "permanent_reservation_minute",
    "permanent_reservation_lesson_length",
    "permanent_reservation_lesson_count",
    "special_discount",
  ]);

  try {
    const planInfo = await findRecordByFk(PlanInfo, user_id);
    if (!planInfo) {
      return handleErrorResponse(res, 404, "Plan info not found");
    }
    // if has_permanent_reservation is false during update it means the user
    // could be changing from a permanent reservation to a regular reservation
    // so we need to delete all future lesson reservations that were automatically
    // created by the system based on the plan info
    if (updateData.has_permanent_reservation === false) {
      const futureLessonReservations = await findAllRecords(LessonReservation, {
        user_id,
        date: { [Op.gt]: new Date() },
      });
      await Promise.all(
        futureLessonReservations.map(async (futureLessonReservation) => {
          await deleteRecord(LessonReservation, futureLessonReservation.id);
        })
      );
      updateData.permanent_reservation_weekday = null;
      updateData.permanent_reservation_hour = null;
      updateData.permanent_reservation_minute = null;
      updateData.permanent_reservation_lesson_length = null;

      // if has_permanent_reservation is true during update it means the user
      // could be changing from a regular reservation to a permanent reservation
      // or could be updating the existing permanent reservation time or length
      // so we have to check for conflicts with other plan infos
    } else if (updateData.has_permanent_reservation === true) {
      const otherPlanInfos = await findAllRecords(PlanInfo, {
        user_id: { [Op.ne]: user_id },
        permanent_reservation_weekday: {
          [Op.eq]: updateData.permanent_reservation_weekday,
        },
      });
      if (otherPlanInfos.length !== 0) {
        const conflicts = otherPlanInfos.map((otherPlanInfo) => {
          if (planInfoOverlap(updateData, otherPlanInfo))
            return otherPlanInfo.user_id;
          return null;
        });
        if (conflicts.filter((conflict) => conflict !== null).length > 0) {
          return handleErrorResponse(
            res,
            409,
            `Plan info conflicts with user ${conflicts.join(", ")}`
          );
        }
      }
    }
    const updateDataNoDuplicates = unchangedDataToUndefined(
      planInfo,
      updateData
    );
    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(res, 400, "No update data provided");
    }
    if (updateDataNoDuplicates.has_permanent_reservation === true) {
      updateDataNoDuplicates.plan_discount =
        config.config.planInfo.permanentPlanDiscountPercent;
    } else if (updateDataNoDuplicates.has_permanent_reservation === false) {
      updateDataNoDuplicates.plan_discount = 0;
    }
    const updateRowsCount = await updateRecord(
      PlanInfo,
      updateDataNoDuplicates,
      user_id
    );
    if (updateRowsCount === 0) {
      return handleErrorResponse(res, 409, "Update failed");
    }
    // if has_permanent_reservation is true during update and the update wasn't
    // stopped by conflicts or duplicates it must mean that the user is changing from a regular
    // reservation to a permanent reservation or adjusting the permanent reservation
    // time which means we need to sync the automatic lesson reservations based on
    // the new plan info to see the changes in the database
    if (updateData.has_permanent_reservation === true) {
      await syncAutomaticLessonReservations();
    }

    return handleSuccessResponse(res, 200, "Plan info updated successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updatePlanInfo;
