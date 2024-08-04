const { PageText } = require("../../models");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");
const { logger } = require("../../utilities/mailer");

async function createPageText(req, res, next) {
  // data = { section, category, position, content_pl, content_en };
  const data = req.body;
  try {
    await createRecord(PageText, data);
    return handleSuccessResponse(res, 201, "Page text created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createPageText;
