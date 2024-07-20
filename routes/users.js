var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");

/* GET users listing. */
router
  .route("/")
  .get(usersController.getUser)
  .post(usersController.createUser)
  .patch(usersController.updateUser);

module.exports = router;
