const express = require("express");
const router = express.Router();
const userTasksController = require("../controllers/userTasks");
const {
  validateGetUserTasks,
  validateCreateUserTask,
  validateUpdateUserTask,
  validateDeleteUserTask,
  validateUpdateUserTaskNotes,
} = require("../validators/userTasksValidators");

router
  .route("/")
  .get(validateGetUserTasks, userTasksController.getUserTasks)
  .post(validateCreateUserTask, userTasksController.createUserTask)
  .patch(validateUpdateUserTask, userTasksController.updateUserTask)
  .delete(validateDeleteUserTask, userTasksController.deleteUserTask);
router
  .route("/userNotes")
  .patch(validateUpdateUserTaskNotes, userTasksController.updateUserTaskNotes);

module.exports = router;
