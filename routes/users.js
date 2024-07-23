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

router
  .route("/")
  .get(validateGetUser, usersController.getUser)
  .post(validateCreateUser, usersController.createUser)
  .patch(validateUpdateUser, usersController.updateUser)
  .delete(validateDeleteUser, usersController.deleteUser);

router
  .route("/reset_password")
  .post(validateResetPasswordRequest, usersController.resetPasswordRequest)
  .patch(validateResetPassword, usersController.resetPassword);

module.exports = router;
