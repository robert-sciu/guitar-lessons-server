const jwt = require("jsonwebtoken");
const { logger } = require("../../utilities/logger");
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");

function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return handleErrorResponse(res, 401, "No token, authorization denied");
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateJWT(decoded);
    return handleSuccessResponse(res, 200, { token: accessToken });
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 401, "Token is not valid");
  }
}

module.exports = refreshToken;
