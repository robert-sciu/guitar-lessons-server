const {
  findRecordByPk,
  handleErrorResponse,
  deleteRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const { logger } = require("../../utilities/mailer");

const { Tag } = require("../../models").sequelize.models;

async function deleteTag(req, res) {
  const id = req.query.id;
  try {
    const tag = await findRecordByPk(Tag, id);
    if (!tag) {
      return handleErrorResponse(res, 404, "Tag not found");
    }
    await deleteRecord(Tag, id);
    return handleSuccessResponse(res, 200, "Tag deleted successfully");
  } catch (error) {
    logger.error(error);
    handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteTag;
