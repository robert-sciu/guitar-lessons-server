const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../../utilities/controllerUtilites");
const userService = require("../userService");
const logger = require("../../../utilities/logger");
const responses = require("../../../responses");

async function getUsersAdmin(req, res) {
  const language = req.language;
  try {
    const users = await userService.getAllUsers();
    return handleSuccessResponse(res, 200, users);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getUsersAdmin;
