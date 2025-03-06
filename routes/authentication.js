const loginController = require("../controllers/authentication");
const {
  validateLogin,
  validateRefreshToken,
} = require("../validators/loginValidators");

const express = require("express");

const authRouterOpen = () => {
  const router = express.Router();

  router.route("/login").post(validateLogin, loginController.login);

  router
    .route("/refreshToken")
    .post(validateRefreshToken, loginController.refreshToken);

  router.route("/logout").post(validateRefreshToken, loginController.logout);

  return router;
};

const authRouterProtected = () => {
  const router = express.Router();

  router.route("/verifyToken").post(loginController.verifyToken);

  return router;
};

const authRouterAdmin = () => {
  const router = express.Router();

  router.route("/verifyToken").post(loginController.verifyAdminToken);

  return router;
};

module.exports = {
  authRouterOpen,
  authRouterProtected,
  authRouterAdmin,
};
