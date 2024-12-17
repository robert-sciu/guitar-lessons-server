var express = require("express");
var router = express.Router();
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
const {
  authenticateJWT,
  authenticateAdminJWT,
} = require("../middleware/authenticationMiddleware");
const { attachIdParam } = require("../middleware/commonMiddleware");

const openRoutes = (router) => {
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

const protectedRoutes = (router) => {
  router
    .route("/")
    .get(authenticateJWT, validateGetUser, usersController.getUser)
    .patch(authenticateJWT, validateUpdateUser, usersController.updateUser);

  router
    .route("/change_email_address")
    .post(
      authenticateJWT,
      validateChangeEmailRequest,
      usersController.changeEmailRequest
    )
    .patch(authenticateJWT, validateChangeEmail, usersController.changeEmail);

  return router;
};

const adminRoutes = (router) => {
  router
    .route("/admin")
    .get(authenticateAdminJWT, usersController.getUsersAdmin);

  router
    .route("/admin/:id")
    .patch(
      authenticateAdminJWT,
      validateUpdateUser,
      attachIdParam,
      usersController.updateUserAdmin
    )
    .delete(
      authenticateAdminJWT,
      validateDeleteUser,
      attachIdParam,
      usersController.deleteUserAdmin
    );

  return router;
};

module.exports = (router) => {
  openRoutes(router);
  protectedRoutes(router);
  adminRoutes(router);
  return router;
};
