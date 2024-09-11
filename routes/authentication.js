const express = require("express");
const router = express.Router();
const loginController = require("../controllers/authentication");
const { authenticateJWT } = require("../utilities/authenticationMiddleware");
const {
  validateLogin,
  validateRefreshToken,
} = require("../validators/loginValidators");

router.route("/login").post(validateLogin, loginController.login);

router.route("/logout").post(validateRefreshToken, loginController.logout);

router
  .route("/refreshToken")
  .post(validateRefreshToken, loginController.refreshToken);

router.route("/verifyToken").post(authenticateJWT, loginController.verifyToken);

module.exports = router;
