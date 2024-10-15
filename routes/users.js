var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users");
const {
  validateGetUser,
  validateUpdateUser,
  validateChangeEmailRequest,
  validateChangeEmail,
} = require("../validators/userValidators");
const { authenticateJWT } = require("../utilities/authenticationMiddleware");

router
  .route("/")
  .get(authenticateJWT, validateGetUser, usersController.getUser)
  .post(usersController.createUser)
  .patch(authenticateJWT, validateUpdateUser, usersController.updateUser)
  .delete(usersController.deleteUser);

router
  .route("/reset_password")
  .post(usersController.resetPasswordRequest)
  .patch(usersController.resetPassword);

router
  .route("/change_email_address")
  .post(
    authenticateJWT,
    validateChangeEmailRequest,
    usersController.changeEmailRequest
  )
  .patch(authenticateJWT, validateChangeEmail, usersController.changeEmail);

module.exports = router;
