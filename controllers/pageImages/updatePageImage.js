const { PageImage } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  updateRecord,
  destructureData,
  deleteAllPageImageFiles,
  addFilePathsToImageData,
  generateCompressedImageObjects,
  checkMissingUpdateData,
  findRecordByValue,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");

async function updatePageImage(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const pageImagesBucketEnpoint = process.env.BUCKET_PAGE_IMAGES;

  const id = req.query.id;
  const updateData = destructureData(req.body, [
    "title",
    "section",
    "category",
    "position",
    "size_on_page",
  ]);
  const { size_on_page, title } = updateData;
  const file = req.file;
  const transaction = await sequelize.transaction();

  try {
    const pageImage = await findRecordByPk(PageImage, id, transaction);
    if (!pageImage) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "Page image not found");
    }
    // position must be converted for successful comparison
    // position is a number in the database
    // position is a string coming from the frontend
    updateData.position = updateData.position
      ? Number(updateData.position)
      : undefined;
    const updateDataNoDuplicates = unchangedDataToUndefined(
      pageImage,
      updateData
    );
    if (checkMissingUpdateData(updateDataNoDuplicates) && !file) {
      await transaction.rollback();
      return handleErrorResponse(res, 400, "No update data provided");
    }
    if (
      updateDataNoDuplicates.title &&
      (await findRecordByValue(PageImage, { title }, transaction))
    ) {
      await transaction.rollback();
      return handleErrorResponse(
        res,
        409,
        `Page image record named ${title} already exists. Please choose a different name.`
      );
    }
    if (file) {
      updateDataNoDuplicates.filename = file.originalname;
      // it the files can be updated the old files will be deleted and new ones will be uploaded
      const { filename_desktop, filename_mobile, filename_lazy } =
        addFilePathsToImageData(
          updateDataNoDuplicates,
          size_on_page ? size_on_page : pageImage.size_on_page
        );
      updateDataNoDuplicates.filename_desktop = filename_desktop;
      updateDataNoDuplicates.filename_mobile = filename_mobile;
      updateDataNoDuplicates.filename_lazy = filename_lazy;
    }
    const updatedRowsCount = await updateRecord(
      PageImage,
      updateDataNoDuplicates,
      id,
      transaction
    );
    if (updatedRowsCount === 0) {
      await transaction.rollback();
      return handleErrorResponse(res, 500, "Failed to update page image");
    }

    // I took a break from handling the file upload until the database is updated
    // so that the image can be uploaded in the next request and rollback the transaction
    // if there is an error during the file upload

    if (file) {
      await deleteAllPageImageFiles(pageImage);

      [desktopImageData, mobileImageData, lazyImageData] =
        await generateCompressedImageObjects({
          bucketName,
          imgPath: pageImagesBucketEnpoint,
          inputFile: file,
          desktopSize: size_on_page ? size_on_page : pageImage.size_on_page,
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
    }
    await transaction.commit();
    return handleSuccessResponse(res, 200, "Page image updated successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}
module.exports = updatePageImage;
