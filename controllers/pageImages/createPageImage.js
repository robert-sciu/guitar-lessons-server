const { PageImage } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  destructureData,
  findRecordByValue,
  generateCompressedImageObjects,
  addFilePathsToImageData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

const s3Manager = require("../../utilities/s3Manager");

async function createPageImage(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const pageImagesBucketEnpoint = process.env.BUCKET_PAGE_IMAGES;

  const data = destructureData(req.body, [
    "title",
    "section",
    "category",
    "position",
    "size_on_page",
  ]);
  const { size_on_page } = data;
  const file = req.file;
  data.filename = file.originalname;
  const transaction = await sequelize.transaction();

  try {
    if (
      await findRecordByValue(PageImage, { title: data.title }, transaction)
    ) {
      await transaction.rollback();
      return handleErrorResponse(
        res,
        409,
        `Page image record named ${data.title} already exists. Please choose a different name.`
      );
    }
    const dataWithFilePaths = addFilePathsToImageData(data, size_on_page);
    const pageImageRecord = await createRecord(
      PageImage,
      dataWithFilePaths,
      transaction
    );
    if (!pageImageRecord) {
      await transaction.rollback();
      return handleErrorResponse(res, 500, "Error creating page image");
    }
    // generateCompressedImageObjects generates compressed image objects based on the provided parameters
    // and returns three objects: desktopImageData, mobileImageData and lazyImageData with the compressed images
    // ready to be uploaded to S3
    [desktopImageData, mobileImageData, lazyImageData] =
      await generateCompressedImageObjects({
        bucketName,
        imgPath: pageImagesBucketEnpoint,
        inputFile: file,
        desktopSize: size_on_page,
      });
    if (
      await s3Manager.bulkCheckIfFilesExist([
        desktopImageData,
        mobileImageData,
        lazyImageData,
      ])
    ) {
      await transaction.rollback();
      return handleErrorResponse(res, 409, "Image already exists");
    }
    await s3Manager.bulkUploadFiles([
      desktopImageData,
      mobileImageData,
      lazyImageData,
    ]);
    await transaction.commit();
    return handleSuccessResponse(res, 201, "Page image created successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createPageImage;
