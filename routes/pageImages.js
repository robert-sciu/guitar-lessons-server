const express = require("express");
const router = express.Router();
const uploadFile = require("../utilities/multer");
const pageImagesController = require("../controllers/pageImages");
const {
  validateCreatePageImages,
} = require("../validators/pageImagesValidators");

router
  .route("/")
  .post(
    uploadFile,
    validateCreatePageImages,
    pageImagesController.createPageImage
  );

module.exports = router;
