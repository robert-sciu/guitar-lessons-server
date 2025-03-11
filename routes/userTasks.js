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
const { authenticateJWT } = require("../middleware/authenticationMiddleware");
const { attachIdParam } = require("../middleware/commonMiddleware");

router.route("/");

const userTasksRouterProtected = () => {
  const router = express.Router();

  router
    .route("/")
    .get(userTasksController.getUserTasks)
    .post(userTasksController.createUserTask);

  router.route("/userNotes").patch(userTasksController.updateUserTaskNotes);

  router.route("/completed").get(userTasksController.getCompletedUserTasks);

  router
    .route("/:id")
    .delete(attachIdParam, userTasksController.deleteUserTask);

  return router;
};

const userTasksRouterAdmin = () => {
  const router = express.Router();

  router
    .route("/:id")
    .get(attachIdParam, userTasksController.getUserTasks)
    .patch(userTasksController.updateUserTask);

  router.route("/:id").post(attachIdParam, userTasksController.createUserTask);

  router
    .route("/:id")
    .delete(attachIdParam, userTasksController.deleteUserTask);

  return router;
};

module.exports = {
  userTasksRouterProtected,
  userTasksRouterAdmin,
};
