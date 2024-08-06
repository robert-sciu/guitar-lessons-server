const { Tag } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
  destructureData,
  checkMissingUpdateData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function updateTag(req, res) {
  const availableCategories = process.env.TAG_CATEGORIES;
  const id = req.query.id;
  const updateData = destructureData(req.body, ["category", "value"]);

  const tag = await findRecordByPk(Tag, id);
  if (!tag) {
    return handleErrorResponse(res, 404, "Tag not found");
  }
  if (checkMissingUpdateData(updateData)) {
    return handleErrorResponse(res, 400, "No update data provided");
  }
  const { category } = updateData;
  if (category) {
    if (!availableCategories.includes(category)) {
      return handleErrorResponse(res, 400, "Invalid category");
    }
  }
  try {
    const updatedRowsCount = await updateRecord(Tag, updateData, id);
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
