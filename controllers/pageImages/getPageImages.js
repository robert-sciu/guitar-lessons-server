const { PageImage } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");
const {
  handleSuccessResponse,
  handleErrorResponse,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const s3Manager = require("../../utilities/s3Manager");
const { attachImageURLs } = require("../../utilities/minioS3Uploader");

async function getPageImages(req, res) {
  try {
    const pageImages = await findAllRecords(PageImage);
    if (pageImages.length < 1) {
      return handleErrorResponse(res, 404, "No page images found");
    }
    const pageImagesWithUrls = await attachImageURLs(
      pageImages,
      process.env.BUCKET_NAME
    );

    return handleSuccessResponse(res, 200, pageImagesWithUrls);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getPageImages;
