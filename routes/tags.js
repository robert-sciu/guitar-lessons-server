const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tags");

const {
  validateGetTags,
  validateCreateTag,
  validateUpdateTag,
  validateDeleteTag,
} = require("../validators/tagValidators");

router
  .route("/")
  .get(validateGetTags, tagsController.getTags)
  .post(validateCreateTag, tagsController.createTag)
  .patch(validateUpdateTag, tagsController.updateTag)
  .delete(validateDeleteTag, tagsController.deleteTag);

module.exports = router;
