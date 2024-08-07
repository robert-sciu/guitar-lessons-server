const { PageImage } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  destructureData,
  findRecordByValue,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const s3Manager = require("../../utilities/s3Manager");
const { attachImagePaths } = require("../../utilities/minioS3Uploader");

async function getPageImages(req, res) {
  try {
    const pageImages = await findAllRecords(PageImage);
    if (pageImages.length < 1) {
      return handleErrorResponse(res, 404, "No page images found");
    }
    const imagesDataArrayJSON = pageImages.map((imageData) =>
      imageData.toJSON()
    );
    await attachImagePaths(imagesDataArrayJSON, process.env.BUCKET_NAME);

    return handleSuccessResponse(res, 200, imagesDataArrayJSON);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getPageImages;
