var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");
const {
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
} = require("../validators/userValidators");

/* GET users listing. */
router
  .route("/")
  .get(validateGetUser, usersController.getUser)
  .post(validateCreateUser, usersController.createUser)
  .patch(validateUpdateUser, usersController.updateUser);

module.exports = router;
