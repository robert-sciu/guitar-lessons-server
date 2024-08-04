const { Tag } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getTags(req, res) {
  const id = req.query.id;
  if (id) {
    try {
      const tag = await findRecordByPk(Tag, id);
      if (!tag) {
        return handleErrorResponse(res, 404, "Tag not found");
      }
      return handleSuccessResponse(res, 200, tag);
    } catch (error) {
      logger.error(error);
      return handleErrorResponse(res, 500, "Server error");
    }
  }
  if (!id) {
    try {
      const tags = await findAllRecords(Tag);
      if (tags.length < 1) {
        return handleErrorResponse(res, 404, "No tags found");
      }
      return handleSuccessResponse(res, 200, tags);
    } catch (error) {
      logger.error(error);
      return handleErrorResponse(res, 500, "Server error");
    }
  }
}

module.exports = getTags;
