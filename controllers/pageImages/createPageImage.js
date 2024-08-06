const { PageImage } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  destructureData,
  findRecordByValue,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");
const fileCompressor = require("../../utilities/sharpCompressor");

async function createPageImage(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const pageImagesBucket = process.env.BUCKET_PAGE_IMAGES;
  const pageImagesBucketMobile = process.env.BUCKET_PAGE_IMAGES_MOBILE;
  const pageImagesBucketLazy = process.env.BUCKET_PAGE_IMAGES_LAZY;
  const availableImageSizes = process.env.AVAILABLE_IMAGE_SIZES;
  const data = destructureData(req.body, [
    "title",
    "section",
    "category",
    "position",
    "size_on_page",
  ]);
  const { size_on_page: sizeOnPage } = data;
  const file = req.file;

  const transaction = await sequelize.transaction();

  if (await findRecordByValue(PageImage, { title: data.title }, transaction)) {
    await transaction.rollback();
    return handleErrorResponse(res, 409, "Page image already exists");
  }
  if (!availableImageSizes.includes(sizeOnPage)) {
    await transaction.rollback();
    return handleErrorResponse(res, 400, "Invalid sizeOnPage");
  }
  if (!file) {
    await transaction.rollback();
    return handleErrorResponse(res, 400, "No image provided");
  }
  try {
    data.filename = file.originalname;
    const pageImageRecord = await createRecord(PageImage, data, transaction);
    if (!pageImageRecord) {
      await transaction.rollback();
      return handleErrorResponse(res, 500, "Server error");
    }
    const desktopImageData = {
      bucketName,
      path: pageImagesBucket,
      file: await fileCompressor(sizeOnPage, file),
    };
    const mobileImageData = {
      bucketName,
      path: pageImagesBucketMobile,
      file: await fileCompressor("mobile", file),
    };
    const lazyImageData = {
      bucketName,
      path: pageImagesBucketLazy,
      file: await fileCompressor("lazy", file),
    };

    if (
      await s3Manager.bulkCheckIfFilesExist([
        desktopImageData,
        mobileImageData,
        lazyImageData,
      ])
    ) {
      return handleErrorResponse(res, 409, "Image already exists");
    }

    await s3Manager.bulkUploadFiles([
      desktopImageData,
      mobileImageData,
      lazyImageData,
    ]);
    await transaction.commit();
    return handleSuccessResponse(res, 201, "Image created successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createPageImage;
