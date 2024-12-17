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
const { authenticateJWT } = require("../middleware/authenticationMiddleware");
const { attachIdParam } = require("../middleware/commonMiddleware");

const unprotectedRoutes = (router) => {
  router
    .route("/create_admin")
    .post(validateCreateUser, usersController.createAdmin);

  router.route("/verify_user").post(usersController.verifyUser);

  router.route("/activate_user").post(usersController.activateUser);

  router
    .route("/reset_password")
    .post(validateResetPasswordRequest, usersController.resetPasswordRequest)
    .patch(validateResetPassword, usersController.resetPassword);

  router
    .route("/change_email_address")
    .post(
      authenticateJWT,
      validateChangeEmailRequest,
      usersController.changeEmailRequest
    )
    .patch(authenticateJWT, validateChangeEmail, usersController.changeEmail);

  router
    .route("/:id")
    .patch(
      authenticateJWT,
      validateUpdateUser,
      attachIdParam,
      usersController.updateUser
    )
    .delete(
      authenticateJWT,
      validateDeleteUser,
      attachIdParam,
      usersController.deleteUser
    );

  return router;
};

const protectedRoutes = (router) => {
  router
    .route("/")
    .get(authenticateJWT, validateGetUser, usersController.getUser)
    .post(validateCreateUser, usersController.createUser);
  return router;
};

module.exports = (router) => {
  unprotectedRoutes(router);
  protectedRoutes(router);
  return router;
};
