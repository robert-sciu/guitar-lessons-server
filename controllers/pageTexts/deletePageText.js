const { PageText } = require("../../models");
const {
  findRecordByPk,
  handleErrorResponse,
  deleteRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function deletePageText(req, res) {
  const id = req.query.id;
  try {
    const pageText = await findRecordByPk(PageText, id);
    if (!pageText) {
      return handleErrorResponse(res, 404, "Page text not found");
    }
    await deleteRecord(PageText, id);
    return handleSuccessResponse(res, 200, "Page text deleted successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deletePageText;
