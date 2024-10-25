const { handleSuccessResponse } = require("../../utilities/controllerUtilites");

function verifyToken(req, res) {
  const user = req.user;
  return handleSuccessResponse(res, 200, { message: "Token verified", user });
}

module.exports = verifyToken;
