const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");
const responses = require("../../responses");
const logger = require("../../utilities/logger");
const pricingService = require("./pricingService");

async function getPricing(req, res) {
  const language = req.language;
  try {
    const pricingData = await pricingService.getPricing();

    return handleSuccessResponse(res, 200, pricingData);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getPricing;
