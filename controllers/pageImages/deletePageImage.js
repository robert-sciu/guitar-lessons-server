const { PageImage } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  deleteRecord,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");

async function deletePageImage(req, res) {
  const id = req.query.id;
  const transcation = await sequelize.transaction();
  const bucketName = process.env.BUCKET_NAME;
  const pageImagesBucketEnpoint = process.env.BUCKET_PAGE_IMAGES;
  const imgTypeEndpoints = {
    desktop: process.env.DESKTOP_IMG_PATH,
    mobile: process.env.MOBILE_IMG_PATH,
    lazy: process.env.LAZY_IMG_PATH,
  };

  try {
    const pageImage = await findRecordByPk(PageImage, id);
    if (!pageImage) {
      await transcation.rollback();
      return handleErrorResponse(res, 404, "Page image not found");
    }

    const { filenameDesktop, filenameMobile, filenameLazy } = pageImage;
    const filenames = [filenameDesktop, filenameMobile, filenameLazy];

    await deleteRecord(PageImage, id, transcation);

    // filenames are prefixed with their type (desktop, mobile, lazy) which is the same as folders they are in
    // so we can use these prefixes to get endpoints from the imgTypeEndpoints object
    await Promise.all(
      filenames.map(async (filename) => {
        const imgtypeEndpoint = imgTypeEndpoints[filename.split("-")[0]];
        await s3Manager.deleteFileFromS3(
          bucketName,
          `${pageImagesBucketEnpoint}/${imgtypeEndpoint}/${filename}`
        );
      })
    );
    await transcation.commit();
    return handleSuccessResponse(res, 200, pageImage);
  } catch (error) {
    await transcation.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deletePageImage;
