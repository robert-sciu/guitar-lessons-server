const express = require("express");
const router = express.Router();

const {
  validateCreatePageText,
  validateUpdatePageText,
  validateDeletePageText,
} = require("../validators/pageTextsValidators");

const pageTextsController = require("../controllers/pageTexts");

router
  .route("/")
  .get(pageTextsController.getPageTexts)
  .post(validateCreatePageText, pageTextsController.createPageText)
  .patch(validateUpdatePageText, pageTextsController.updatePageText)
  .delete(validateDeletePageText, pageTextsController.deletePageText);

module.exports = router;
