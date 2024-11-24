const { logger } = require("../../utilities/logger");
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");
const responses = require("../../responses");
const authenticationService = require("./authenticationService");

async function refreshToken(req, res) {
  const language = req.language;
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return handleErrorResponse(
      res,
      401,
      responses.authenticationMessages.noToken[language]
    );
  }
  try {
    const decoded = authenticationService.decodeJWT(refreshToken);
    const storedToken = await authenticationService.getStoredToken(
      refreshToken
    );
    if (!storedToken) {
      return handleErrorResponse(
        res,
        401,
        responses.authenticationMessages.invalidToken[language]
      );
    }
    if (storedToken.expires < Date.now()) {
      return handleErrorResponse(
        res,
        401,
        responses.authenticationMessages.tokenExpired[language]
      );
    }
    const accessToken = authenticationService.getJWT(decoded);
    return handleSuccessResponse(res, 200, { token: accessToken });
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      401,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = refreshToken;
