const {
  destructureData,
  findRecordByPk,
  handleErrorResponse,
  checkMissingUpdateData,
  updateRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const { YouTubeVideo, User } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function updateYouTubeVideo(req, res) {
  const id = req.query.id;
  const updateData = destructureData(req.body, [
    "title",
    "section",
    "category",
    "position",
    "url",
    "user_id",
  ]);
  try {
    const youTubeVideo = await findRecordByPk(YouTubeVideo, id);
    if (!youTubeVideo) {
      return handleErrorResponse(res, 404, "Video not found");
    }
    if (
      updateData.user_id &&
      !(await findRecordByPk(User, updateData.user_id))
    ) {
      return handleErrorResponse(res, 404, "User not found");
    }
    if (checkMissingUpdateData(updateData)) {
      return handleErrorResponse(res, 400, "No update data provided");
    }
    const updatedRowsCount = await updateRecord(YouTubeVideo, updateData, id);
    if (updatedRowsCount === 0) {
      return handleErrorResponse(res, 409, "Video not updated");
    }
    return handleSuccessResponse(res, 201, "Video updated successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateYouTubeVideo;
