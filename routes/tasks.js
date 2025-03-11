const express = require("express");
const uploadFile = require("../middleware/multerFileUpload");
const tasksController = require("../controllers/tasks");
const {
  validateGetTasks,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
} = require("../validators/taskValidators");
const { attachIdParam } = require("../middleware/commonMiddleware");

const tasksRouterProtected = () => {
  const router = express.Router();

  router.route("/").get(tasksController.getTasks);

  router.route("/download").get(tasksController.getTaskDownload);

  return router;
};

const tasksRouterAdmin = () => {
  const router = express.Router();

  router
    .route("/")
    .post(uploadFile, tasksController.createTask)
    .patch(uploadFile, tasksController.updateTask)
    .delete(tasksController.deleteTask);

  router.route("/:id").get(attachIdParam, tasksController.getTasks);
  return router;
};

module.exports = {
  tasksRouterProtected,
  tasksRouterAdmin,
};
