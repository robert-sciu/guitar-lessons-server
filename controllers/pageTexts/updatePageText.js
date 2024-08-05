const { PageText } = require("../../models");
const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
  findRecordByPk,
  removeEmptyValues,
  destructureData,
} = require("../../utilities/controllerUtilites");

async function updatePageText(req, res) {
  const id = req.query.id;
  const updateData = destructureData(req.body, [
    "position",
    "content_pl",
    "content_en",
  ]);
  const filteredUpdateData = removeEmptyValues(updateData);

  if (checkMissingUpdateData(updateData)) {
    return handleErrorResponse(res, 400, "No update data provided");
  }
  try {
    if (!(await findRecordByPk(PageText, id))) {
      return handleErrorResponse(res, 404, "Page text not found");
    }
    const updatedRowsCount = await updateRecord(
      PageText,
      filteredUpdateData,
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
