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
const { authenticateJWT } = require("../utilities/authenticationMiddleware");
const { attachIdParam } = require("../utilities/middleware");

router
  .route("/")
  .get(authenticateJWT, userTasksController.getUserTasks)
  .post(
    validateCreateUserTask,
    authenticateJWT,
    userTasksController.createUserTask
  )
  .patch(
    validateUpdateUserTask,
    authenticateJWT,
    userTasksController.updateUserTask
  );

router
  .route("/completed")
  .get(authenticateJWT, userTasksController.getCompletedUserTasks);

router
  .route("/:id")
  .delete(authenticateJWT, attachIdParam, userTasksController.deleteUserTask);

router
  .route("/userNotes")
  .patch(
    validateUpdateUserTaskNotes,
    authenticateJWT,
    userTasksController.updateUserTaskNotes
  );

module.exports = router;
