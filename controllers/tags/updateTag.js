const { Tag } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function updateTag(req, res) {
  const id = req.query.id;
  const updateData = req.body;
  const availableCategories = process.env.TAG_CATEGORIES;
  const tag = await findRecordByPk(Tag, id);

  if (!tag) {
    return handleErrorResponse(res, 404, "Tag not found");
  }
  const { category } = updateData;
  if (category) {
    if (!availableCategories.includes(category)) {
      return handleErrorResponse(res, 400, "Invalid category");
    }
  }
  try {
    await updateRecord(Tag, updateData, id);
    return handleSuccessResponse(res, 200, "Tag updated successfully");
  } catch (error) {
    logger.error(error);
    handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateTag;
