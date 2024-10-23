const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const logger = require("../../utilities/logger");
const userTaskService = require("./userTaskService");
const responses = require("../../responses");

async function getUserTasks(req, res) {
  const language = req.language;
  const user_id = req.user.id;
  try {
    const completedTasks = await userTaskService.fetchUserTasks(user_id, true);
    return handleSuccessResponse(res, 200, completedTasks);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = getUserTasks;
