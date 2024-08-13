const { PageText } = require("../../models");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  destructureData,
} = require("../../utilities/controllerUtilites");
const { logger } = require("../../utilities/mailer");

async function createPageText(req, res, next) {
  const data = destructureData(req.body, [
    "section",
    "category",
    "position",
    "content_pl",
    "content_en",
  ]);
  try {
    await createRecord(PageText, data);
    return handleSuccessResponse(res, 201, "Page text created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createPageText;
