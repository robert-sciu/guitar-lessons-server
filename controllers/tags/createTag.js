const {
  handleErrorResponse,
  handleSuccessResponse,
  createRecord,
} = require("../../utilities/controllerUtilites");
const { logger } = require("../../utilities/mailer");

const { Tag } = require("../../models").sequelize.models;

async function createTag(req, res) {
  const categories = process.env.TAG_CATEGORIES;
  const data = req.body;
  const { category } = data;

  if (!categories.includes(category)) {
    return handleErrorResponse(res, 400, "Invalid category");
  }
  try {
    await createRecord(Tag, data);
    return handleSuccessResponse(res, 201, "Tag created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createTag;
