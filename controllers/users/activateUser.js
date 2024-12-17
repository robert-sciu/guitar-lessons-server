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

    const tokenVerified = await userService.compareActivationToken(
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
    await userService.setUserActive(decoded.id);

    await userService.deleteToken(token, decoded.id, "activation");

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
