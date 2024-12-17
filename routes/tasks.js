const express = require("express");
const router = express.Router();
const uploadFile = require("../utilities/multer");
const tasksController = require("../controllers/tasks");
const {
  validateGetTasks,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
} = require("../validators/taskValidators");
const { authenticateJWT } = require("../middleware/authenticationMiddleware");

router
  .route("/")
  .get(validateGetTasks, authenticateJWT, tasksController.getTasks)
  .post(uploadFile, validateCreateTask, tasksController.createTask)
  .patch(uploadFile, validateUpdateTask, tasksController.updateTask)
  .delete(validateDeleteTask, tasksController.deleteTask);

router.route("/download").get(tasksController.getTaskDownload);

module.exports = router;
