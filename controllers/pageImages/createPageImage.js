const { PageImage } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  createRecord,
  handleSuccessResponse,
  handleErrorResponse,
  destructureData,
  findRecordByValue,
  generateCompressedImageObjects,
  createStandardImageSizesConfig,
  createFilenamePropertiesFromSizeList,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

const s3Manager = require("../../utilities/s3Manager");

async function createPageImage(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const pageImagesBucketEnpoint = process.env.BUCKET_PAGE_IMAGES;

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
  const sizes = createStandardImageSizesConfig(sizeOnPage);

  const transaction = await sequelize.transaction();

  if (!availableImageSizes.includes(sizeOnPage)) {
    await transaction.rollback();
    return handleErrorResponse(res, 400, "Invalid sizeOnPage");
  }
  if (!file) {
    await transaction.rollback();
    return handleErrorResponse(res, 400, "No image provided");
  }
  try {
    if (
      await findRecordByValue(PageImage, { title: data.title }, transaction)
    ) {
      await transaction.rollback();
      return handleErrorResponse(
        res,
        409,
        `Page image named ${data.title} already exists. Please choose a different name.`
      );
    }
    const dataWithFilenameProperties = createFilenamePropertiesFromSizeList(
      data,
      sizes,
      file.originalname
    );

    const pageImageRecord = await createRecord(
      PageImage,
      dataWithFilenameProperties,
      transaction
    );
    if (!pageImageRecord) {
      await transaction.rollback();
      return handleErrorResponse(res, 500, "Error creating page image");
    }
    [desktopImageData, mobileImageData, lazyImageData] =
      await generateCompressedImageObjects({
        bucketName,
        imgPath: pageImagesBucketEnpoint,
        inputFile: file,
        compressionSizes: [sizes.desktop, sizes.mobile, sizes.lazy],
      });
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
