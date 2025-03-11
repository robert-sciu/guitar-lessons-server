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

const planInfoService = require("./planInfoService");
const responses = require("../../responses");

async function updatePlanInfo(req, res) {
  const language = req.language;
  const user_id = req.id;
  let updateData = planInfoService.destructurePlanInfoUpdateData(req.body);

  try {
    const planInfo = await planInfoService.getPlanInfo(user_id);
    updateData = unchangedDataToUndefined(planInfo, updateData);

    if (checkMissingUpdateData(updateData)) {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.noUpdateData[language]
      );
    }

    if (updateData.lesson_balance !== undefined) {
      updateData.lesson_balance =
        Number(planInfo.lesson_balance) + Number(updateData.lesson_balance);
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
