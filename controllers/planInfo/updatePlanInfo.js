const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  handleSuccessResponse,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");
const {
  planInfoOverlap,
} = require("../../utilities/planInfoControllerUtilities");
const syncAutomaticLessonReservations = require("../../services/reservationSyncService");

const planInfoService = require("./planInfoService");
const lessonReservationsService = require("../lessonReservations/lessonReservationsService");
const responses = require("../../responses");

async function updatePlanInfo(req, res) {
  const language = req.language;
  const timezone = "Europe/Warsaw";
  const user_id = req.id;
  let updateData = planInfoService.destructurePlanInfoUpdateData(req.body);

  updateData = {
    ...updateData,
    ...planInfoService.getStartAndEndHoursUTC(updateData, timezone), //return null if has_permanent_reservation is false
  };
  updateData.plan_discount =
    planInfoService.calculatePermanentPlanDiscount(updateData);

  try {
    if (updateData.has_permanent_reservation === false) {
      await lessonReservationsService.deleteFuturePermanentReservations(
        user_id
      );

      updateData = {
        ...updateData,
        ...planInfoService.getUpdateDataForCancellingPermanentReservation(),
      };
    }

    if (updateData.has_permanent_reservation === true) {
      const conflictingPermanentReservations =
        await planInfoService.findConflictingPermanentReservations(
          user_id,
          updateData
        );
      if (conflictingPermanentReservations.length > 0) {
        return handleErrorResponse(
          res,
          409,
          responses.planInfoMessages.confictWithPermanentReservation[language]
        );
      }
    }

    const planInfo = await planInfoService.getPlanInfo(user_id);
    updateData = unchangedDataToUndefined(planInfo, updateData);

    if (checkMissingUpdateData(updateData)) {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.noUpdateData[language]
      );
    }

    const updateRowsCount = await planInfoService.updatePlanInfo(
      user_id,
      updateData
    );

    if (updateRowsCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }

    if (updateData.has_permanent_reservation === true) {
      await syncAutomaticLessonReservations();
    }

    return handleSuccessResponse(
      res,
      200,
      responses.commonMessages.updateSuccess[language]
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = updatePlanInfo;
