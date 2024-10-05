var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users");
const {
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser,
  validateResetPasswordRequest,
  validateResetPassword,
} = require("../validators/userValidators");
const {
  authenticateJWT,
  verifyUserIsAdmin,
} = require("../utilities/authenticationMiddleware");

router
  .route("/")
  .get(validateGetUser, authenticateJWT, usersController.getUser)
  .post(usersController.createUser)
  .patch(authenticateJWT, verifyUserIsAdmin, usersController.updateUser)
  .delete(usersController.deleteUser);

router
  .route("/reset_password")
  .post(usersController.resetPasswordRequest)
  .patch(usersController.resetPassword);

module.exports = router;
