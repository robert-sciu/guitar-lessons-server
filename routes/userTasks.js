const express = require("express");
const router = express.Router();
const userTasksController = require("../controllers/userTasks");
const {
  validateGetUserTasks,
  validateCreateUserTask,
  validateDeleteUserTask,
  validateUpdateUserTaskNotes,
} = require("../validators/userTasksValidators");

router
  .route("/")
  .get(validateGetUserTasks, userTasksController.getUserTasks)
  .post(validateCreateUserTask, userTasksController.createUserTask)
  .patch(validateUpdateUserTaskNotes, userTasksController.updateUserTaskNotes)
  .delete(validateDeleteUserTask, userTasksController.deleteUserTask);

module.exports = router;
