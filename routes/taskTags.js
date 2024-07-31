const express = require("express");
const router = express.Router();
const taskTagsController = require("../controllers/taskTags");

const {
  validateGetTaskTags,
  validateCreateTaskTag,
  validateDeleteTaskTag,
} = require("../validators/taskTagsValidators");

router
  .route("/")
  .get(validateGetTaskTags, taskTagsController.getTaskTags)
  .post(validateCreateTaskTag, taskTagsController.createTaskTag)
  .delete(validateDeleteTaskTag, taskTagsController.deleteTaskTag);

module.exports = router;
