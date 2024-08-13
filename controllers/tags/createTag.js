const {
  handleErrorResponse,
  handleSuccessResponse,
  createRecord,
  destructureData,
} = require("../../utilities/controllerUtilites");
const { logger } = require("../../utilities/mailer");

const { Tag } = require("../../models").sequelize.models;

async function createTag(req, res) {
  const data = destructureData(req.body, ["category", "value"]);
  try {
    await createRecord(Tag, data);
    return handleSuccessResponse(res, 201, "Tag created successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createTag;
