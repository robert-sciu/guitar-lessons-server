const logger = require("../../utilities/logger");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const tasksService = require("./tasksService");
const userService = require("../users/userService");
const responses = require("../../responses");
const {
  getUserBasedOnRole,
} = require("../../middleware/getUserBasedOnUserRole");

async function getTasks(req, res) {
  const language = req.language;
  const user = await getUserBasedOnRole(req);
  try {
    const tasks = await tasksService.fetchTasks(user);
    return handleSuccessResponse(res, 200, tasks);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getTasks;
