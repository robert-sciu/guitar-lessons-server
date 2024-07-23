const express = require("express");
const router = express.Router();
const uploadFile = require("../utilities/multer");
const tasksController = require("../controllers/tasks");
const {
  validateCreateTask,
  validateGetTasks,
} = require("../validators/taskValidators");

router
  .route("/")
  .get(validateGetTasks, tasksController.getTasks)
  .post(uploadFile, validateCreateTask, tasksController.createTask);

module.exports = router;
