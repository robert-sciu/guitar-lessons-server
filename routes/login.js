const express = require("express");
const router = express.Router();
const loginController = require("../controllers/authentication");

router.route("/").post(loginController.login);

router.route("/refreshToken").post(loginController.refreshToken);

module.exports = router;
