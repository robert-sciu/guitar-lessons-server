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
const { authenticateJWT } = require("../utilities/authenticationMiddleware");
const { attachIdParam } = require("../utilities/middleware");

router
  .route("/")
  .get(authenticateJWT, validateGetUser, usersController.getUser)
  .post(validateCreateUser, usersController.createUser);

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

module.exports = router;
