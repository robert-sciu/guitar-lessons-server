const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const planInfoService = require("./planInfoService");
const responses = require("../../responses");

async function getPlanInfo(req, res) {
  const language = req.language;
  const user_id = req.user.id;

  try {
    const planInfo = await planInfoService.getPlanInfo(user_id);

    if (!planInfo) {
      return handleErrorResponse(
        res,
        404,
        responses.commonMessages.notFound[language]
      );
    }
    return handleSuccessResponse(res, 200, planInfo);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getPlanInfo;
