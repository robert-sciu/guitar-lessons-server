const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tags");

const {
  validateGetTags,
  validateCreateTag,
  validateUpdateTag,
  validateDeleteTag,
} = require("../validators/tagValidators");

// router
//   .route("/")
//   .get(validateGetTags, tagsController.getTags)
//   .post(validateCreateTag, tagsController.createTag)
//   .patch(validateUpdateTag, tagsController.updateTag)
//   .delete(validateDeleteTag, tagsController.deleteTag);

const tagsRouterOpen = () => {
  const router = express.Router();
  router.route("/").get(tagsController.getTags);
  return router;
};

const tagsRouterAdmin = () => {
  const router = express.Router();
  router
    .route("/")
    .post(validateCreateTag, tagsController.createTag)
    .patch(validateUpdateTag, tagsController.updateTag)
    .delete(validateDeleteTag, tagsController.deleteTag);
  return router;
};

module.exports = {
  tagsRouterOpen,
  tagsRouterAdmin,
};
