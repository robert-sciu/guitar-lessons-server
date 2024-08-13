const { deleteRecord, findRecordByPk } = require("../../utilities/controllerUtilites");
const { YouTubeVideo } = require("../../models").sequelize.models;
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function deleteYouTubeVideo(req, res) {
  const id = req.query.id;
  try {
    if (!await findRecordByPk(YouTubeVideo, id)) {
      return handleErrorResponse(res, 404, "YouTube video not found");
    }
    await deleteRecord(YouTubeVideo, id);
    return handleSuccessResponse(res, 200, "YouTube video deleted successfully");
  } catch (error) {
  
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteYouTubeVideo