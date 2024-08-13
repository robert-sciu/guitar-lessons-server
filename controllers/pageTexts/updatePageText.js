const { PageText } = require("../../models");
const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
  findRecordByPk,
  destructureData,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");

async function updatePageText(req, res) {
  const id = req.query.id;
  const updateData = destructureData(req.body, [
    "position",
    "content_pl",
    "content_en",
  ]);

  try {
    const pageText = await findRecordByPk(PageText, id);

    if (!pageText) {
      return handleErrorResponse(res, 404, "Page text not found");
    }
    const updateDataNoDuplicates = unchangedDataToUndefined(
      pageText,
      updateData
    );
    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(res, 400, "No update data provided");
    }
    const updatedRowsCount = await updateRecord(
      PageText,
      updateDataNoDuplicates,
      id
    );
    if (updatedRowsCount === 0) {
      return handleErrorResponse(res, 409, "Page text not updated");
    }
    return handleSuccessResponse(res, 201, "Page text updated successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updatePageText;
