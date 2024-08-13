const { YouTubeVideo } = require("../../models").sequelize.models;
const {
  handleSuccessResponse,
  handleErrorResponse,
  findRecordByPk,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getYouTubeVideos(req, res) {
  const id = req.query.id;
  if (id) {
    try {
      const video = await findRecordByPk(YouTubeVideo, id);
      if (!video) {
        return handleErrorResponse(res, 404, "Video not found");
      }
      return handleSuccessResponse(res, 200, video);
    } catch (error) {
      logger.error(error);
      return handleErrorResponse(res, 500, "Server error");
    }
  }
  if (!id) {
    try {
      const videos = await findAllRecords(YouTubeVideo);
      if (videos.length < 1) {
        return handleErrorResponse(res, 404, "No videos found");
      }
      return handleSuccessResponse(res, 200, videos);
    } catch (error) {
      logger.error(error);
      return handleErrorResponse(res, 500, "Server error");
    }
  }
}

module.exports = getYouTubeVideos;
