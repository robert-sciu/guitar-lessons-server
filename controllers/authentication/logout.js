const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const responses = require("../../responses");
const authenticationService = require("./authenticationService");

async function logout(req, res) {
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
    const existingToken = await authenticationService.getStoredToken(
      refreshToken
    );
    if (existingToken) {
      await authenticationService.revokeToken(existingToken);
    }
    authenticationService.clearCookies(res);
    return handleSuccessResponse(
      res,
      200,
      responses.authenticationMessages.logoutSuccessful[language]
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = logout;
