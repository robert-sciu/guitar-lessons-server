const logger = require("../../../utilities/logger");
const responses = require("../../../responses");
const planInfoService = require("../planInfoService");
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../../utilities/controllerUtilites");

async function getPlanInfosAdmin(req, res) {
  const language = req.language;
  try {
    const planInfos = await planInfoService.getAllPlanInfos();
    return handleSuccessResponse(res, 200, planInfos);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getPlanInfosAdmin;
