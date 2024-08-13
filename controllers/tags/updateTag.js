const { Tag } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
  destructureData,
  checkMissingUpdateData,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function updateTag(req, res) {
  const id = req.query.id;
  const updateData = destructureData(req.body, ["category", "value"]);
  try {
    const tag = await findRecordByPk(Tag, id);
    if (!tag) {
      return handleErrorResponse(res, 404, "Tag not found");
    }
    const updateDataNoDuplicates = unchangedDataToUndefined(tag, updateData);
    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(res, 400, "No update data provided");
    }
    const updatedRowsCount = await updateRecord(
      Tag,
      updateDataNoDuplicates,
      id
    );
    if (updatedRowsCount === 0) {
      return handleErrorResponse(res, 409, "Tag not updated");
    }
    return handleSuccessResponse(res, 200, "Tag updated successfully");
  } catch (error) {
    logger.error(error);
    handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateTag;
