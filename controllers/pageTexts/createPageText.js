const { PageText } = require("../../models");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  findRecordByPk,
  removeEmptyValues,
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
  const filteredData = removeEmptyValues(data);
  try {
    await createRecord(PageText, filteredData);
    return handleSuccessResponse(res, 201, "Page text created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createPageText;
