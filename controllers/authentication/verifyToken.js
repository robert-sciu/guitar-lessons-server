const jwt = require("jsonwebtoken");
const { handleSuccessResponse } = require("../../utilities/controllerUtilites");

function verifyToken(req, res, next) {
  return handleSuccessResponse(res, 200, "Token verified successfully");
}

module.exports = verifyToken;
