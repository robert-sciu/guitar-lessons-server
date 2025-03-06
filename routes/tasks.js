const express = require("express");
const uploadFile = require("../middleware/multerFileUpload");
const tasksController = require("../controllers/tasks");
const {
  validateGetTasks,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
} = require("../validators/taskValidators");

const tasksRouterProtected = () => {
  const router = express.Router();

  router.route("/").get(validateGetTasks, tasksController.getTasks);

  router.route("/download").get(tasksController.getTaskDownload);

  return router;
};

const tasksRouterAdmin = () => {
  const router = express.Router();

  router
    .route("/")
    .post(uploadFile, validateCreateTask, tasksController.createTask)
    .patch(uploadFile, validateUpdateTask, tasksController.updateTask)
    .delete(validateDeleteTask, tasksController.deleteTask);

  return router;
};

module.exports = {
  tasksRouterProtected,
  tasksRouterAdmin,
};
