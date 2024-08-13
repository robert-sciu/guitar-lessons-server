const { PageImage } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  deleteRecord,
  deleteAllPageImageFiles,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function deletePageImage(req, res) {
  const id = req.query.id;
  const transcation = await sequelize.transaction();
  try {
    const pageImage = await findRecordByPk(PageImage, id);
    if (!pageImage) {
      await transcation.rollback();
      return handleErrorResponse(res, 404, "Page image not found");
    }
    await deleteRecord(PageImage, id, transcation);
    await deleteAllPageImageFiles(pageImage);
    await transcation.commit();
    return handleSuccessResponse(res, 200, "Page image deleted successfully");
  } catch (error) {
    await transcation.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deletePageImage;
