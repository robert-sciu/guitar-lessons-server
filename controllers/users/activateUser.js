const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userService = require("./userService");
const responses = require("../../responses");

async function activateUser(req, res) {
  const language = req.language;
  const token = req.body.token;

  try {
    const decoded = userService.verifyActivationToken(token);

    const tokenVerified = await userService.compareActivationTokens(
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
    await userService.updateUserActivationStatus(decoded.id, true);

    await userService.deleteUserToken(token, decoded.id, "activation");

    return handleSuccessResponse(
      res,
      200,
      responses.usersMessages.userActivated[language]
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      400,
      responses.commonMessages.invalidToken[language]
    );
  }
}

module.exports = activateUser;
