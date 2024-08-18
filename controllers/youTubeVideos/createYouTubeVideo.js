const {
  destructureData,
  handleErrorResponse,
  createRecord,
  handleSuccessResponse,
  findRecordByPk,
  findRecordByFk,
} = require("../../utilities/controllerUtilites");
const { YouTubeVideo, User } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function createYouTubeVideo(req, res) {
  const data = destructureData(req.body, [
    "title",
    "section",
    "category",
    "position",
    "url",
    "user_id",
  ]);
  try {
    if (data.user_id && !(await findRecordByPk(User, data.user_id))) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const existingVideo = await findRecordByFk(YouTubeVideo, {
      title: data.title,
      section: data.section,
      url: data.url,
    });
    if (existingVideo) {
      return handleErrorResponse(res, 409, "YouTube video already exists");
    }

    await createRecord(YouTubeVideo, data);
    return handleSuccessResponse(
      res,
      201,
      "YouTube video created successfully"
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createYouTubeVideo;
