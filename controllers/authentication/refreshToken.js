const jwt = require("jsonwebtoken");
const { logger } = require("../../utilities/logger");
const {
  handleSuccessResponse,
  handleErrorResponse,
  findRecordByValue,
} = require("../../utilities/controllerUtilites");
const { RefreshToken } = require("../../models").sequelize.models;
const { generateJWT } = require("../../utilities/tokenUtilities");

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return handleErrorResponse(res, 401, "No token, authorization denied");
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const storedToken = await findRecordByValue(RefreshToken, {
      token: refreshToken,
      revoked: false,
    });

    if (!storedToken) {
      return handleErrorResponse(res, 401, "Token is not valid");
    }

    if (storedToken.expires < Date.now()) {
      return handleErrorResponse(res, 401, "Token is not valid");
    }

    const accessToken = generateJWT(decoded);
    return handleSuccessResponse(res, 200, { token: accessToken });
  } catch (error) {
    // logger.error(error);
    return handleErrorResponse(res, 401, "Token is not valid");
  }
}

module.exports = refreshToken;
