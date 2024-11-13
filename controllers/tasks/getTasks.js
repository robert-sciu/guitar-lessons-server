const logger = require("../../utilities/logger");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const tasksService = require("./tasksService");
const responses = require("../../responses");

async function getTasks(req, res) {
  const language = req.language;
  try {
    const tasks = await tasksService.fetchTasks(req.user);
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
