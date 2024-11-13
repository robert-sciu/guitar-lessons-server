const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const responses = require("../../responses");
const userService = require("./userService");

async function getUser(req, res) {
  const language = req.language;
  const user = req.user;
  try {
    if (userService.userIsUser(user)) {
      return handleSuccessResponse(res, 200, user);
    }
    if (userService.userIsAdmin(user)) {
      const users = await userService.findAllUsers();
      if (!users) {
        return handleErrorResponse(
          res,
          404,
          responses.usersMessages.usersNotFound[language]
        );
      }
      return handleSuccessResponse(res, 200, users);
    }
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getUser;
