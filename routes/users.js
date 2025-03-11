const usersController = require("../controllers/users");
const {
  validateGetUser,
  validateUpdateUser,
  validateChangeEmailRequest,
  validateChangeEmail,
  validateDeleteUser,
  validateResetPasswordRequest,
  validateResetPassword,
  validateCreateUser,
} = require("../validators/userValidators");

const { attachIdParam } = require("../middleware/commonMiddleware");

const express = require("express");

const userRouterOpen = () => {
  const router = express.Router();

  router.route("/").post(validateCreateUser, usersController.createUser);

  router
    .route("/create_admin")
    .post(validateCreateUser, usersController.createAdmin);

  router.route("/verify_user").post(usersController.verifyUser);

  router.route("/activate_user").post(usersController.activateUser);

  router
    .route("/reset_password")
    .post(validateResetPasswordRequest, usersController.resetPasswordRequest)
    .patch(validateResetPassword, usersController.resetPassword);

  return router;
};

const userRouterProtected = () => {
  const router = express.Router();

  router
    .route("/")
    .get(validateGetUser, usersController.getUser)
    .patch(usersController.updateUser);

  router
    .route("/change_email_address")
    .post(validateChangeEmailRequest, usersController.changeEmailRequest)
    .patch(validateChangeEmail, usersController.changeEmail);

  return router;
};

const userRouterAdmin = () => {
  const router = express.Router();

  router.route("/").get(usersController.getAllUsers);

  router
    .route("/:id")
    .all(attachIdParam)
    .patch(usersController.updateUserAdmin)
    .delete(usersController.deleteUser);

  return router;
};

module.exports = {
  userRouterProtected,
  userRouterAdmin,
  userRouterOpen,
};
