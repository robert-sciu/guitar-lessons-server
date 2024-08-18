const { PageText } = require("../../models");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  destructureData,
  findRecordByFk,
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
    const existingPageText = await findRecordByFk(PageText, {
      section: data.section,
      content_pl: data.content_pl,
      content_en: data.content_en,
    });
    if (existingPageText) {
      return handleErrorResponse(res, 409, "Page text already exists");
    }
    await createRecord(PageText, data);
    return handleSuccessResponse(res, 201, "Page text created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createPageText;
