const express = require("express");
const router = express.Router();
const uploadFile = require("../middleware/multerFileUpload");
const pageImagesController = require("../controllers/pageImages");
const {
  validateCreatePageImage,
  validateUpdatePageImage,
  validateDeletePageImage,
} = require("../validators/pageImagesValidators");

router
  .route("/")
  .get(pageImagesController.getPageImages)
  .post(
    uploadFile,
    validateCreatePageImage,
    pageImagesController.createPageImage
  )
  .patch(
    uploadFile,
    validateUpdatePageImage,
    pageImagesController.updatePageImage
  )
  .delete(validateDeletePageImage, pageImagesController.deletePageImage);

module.exports = router;
