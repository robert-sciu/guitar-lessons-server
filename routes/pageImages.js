const express = require("express");
const router = express.Router();
const uploadFile = require("../utilities/multer");
const pageImagesController = require("../controllers/pageImages");
const {
  validateCreatePageImages,
} = require("../validators/pageImagesValidators");

router
  .route("/")
  .get(pageImagesController.getPageImages)
  .post(
    uploadFile,
    validateCreatePageImages,
    pageImagesController.createPageImage
  )
  .delete(pageImagesController.deletePageImage);

module.exports = router;
