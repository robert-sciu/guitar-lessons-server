const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userService = require("./userService");
const responses = require("../../responses");

async function verifyUser(req, res) {
  const language = req.language;
  const token = req.body.token;
  try {
    const decoded = userService.verifyVerificationToken(token);

    const tokenVerified = await userService.compareVerificationToken(
      token,
      decoded.id
    );

    if (!tokenVerified) {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.invalidToken[language]
      );
    }
    await userService.setUserVerified(decoded.id);

    const user = await userService.findUserById(decoded.id);

    if (!user.is_verified) {
      return handleErrorResponse(
        res,
        400,
        responses.usersMessages.userNotVerified[language]
      );
    }
    await userService.deleteToken(token, user.id);

    return handleSuccessResponse(
      res,
      200,
      responses.commonMessages.updateSuccess[language]
    );
  } catch (error) {
    if (error.message === "invalid signature") {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.invalidToken[language]
      );
    }
    if (error.message === "jwt expired") {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.tokenExpired[language]
      );
    }
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = verifyUser;
