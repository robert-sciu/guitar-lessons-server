const express = require("express");
const router = express.Router();
const youTubeVideosController = require("../controllers/youTubeVideos");
const {
  validateGetYouTubeVideos,
  validateCreateYouTubeVideo,
  validateUpdateYouTubeVideo,
  validateDeleteYouTubeVideo,
} = require("../validators/youtubeVideosValidators");

router
  .route("/")
  .get(validateGetYouTubeVideos, youTubeVideosController.getYouTubeVideos)
  .post(validateCreateYouTubeVideo, youTubeVideosController.createYouTubeVideo)
  .patch(validateUpdateYouTubeVideo, youTubeVideosController.updateYouTubeVideo)
  .delete(
    validateDeleteYouTubeVideo,
    youTubeVideosController.deleteYouTubeVideo
  );

module.exports = router;
