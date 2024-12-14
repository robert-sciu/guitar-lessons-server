const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const authenticationService = require("./authenticationService");
const responses = require("../../responses");

async function login(req, res) {
  const language = req.language;
  const { email, password } = req.body;
  try {
    const user = await authenticationService.getUserByEmail(email);
    if (!user) {
      return handleErrorResponse(
        res,
        404,
        responses.authenticationMessages.userNotFound[language]
      );
    }
    if (
      !(await authenticationService.verifyPassword(user.password, password))
    ) {
      return handleErrorResponse(
        res,
        401,
        responses.authenticationMessages.wrongPasswordOrEmail[language]
      );
    }
    const accessToken = authenticationService.getJWT(user);
    const refreshToken = authenticationService.getRefreshJWT(user);
    const isVerified = user.is_verified;

    await authenticationService.saveRefreshToken(refreshToken, user.id);
    authenticationService.attachCookies(res, refreshToken);

    return handleSuccessResponse(res, 200, {
      token: accessToken,
      isVerified,
    });
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = login;
