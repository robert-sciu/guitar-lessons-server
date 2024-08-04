const { PageText } = require("../../models");
const {
  findAllRecords,
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getPageTexts(req, res) {
  try {
    const pageTexts = await findAllRecords(PageText);
    if (pageTexts.length < 1) {
      return handleErrorResponse(res, 404, "No page texts found");
    }
    return handleSuccessResponse(res, 200, pageTexts);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getPageTexts;
