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

  if (user) {
    return handleSuccessResponse(res, 200, user);
  }

  return handleErrorResponse(
    res,
    500,
    responses.commonMessages.serverError[language]
  );
}

module.exports = getUser;
