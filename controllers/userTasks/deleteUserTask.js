const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userTaskService = require("./userTaskService");
const responses = require("../../responses");

async function deleteUserTask(req, res, next) {
  const language = req.language;
  const task_id = req.id;
  const user_id = req.user.id;
  try {
    const userTask = await userTaskService.findUserTask(user_id, task_id);
    if (!userTask) {
      return handleErrorResponse(
        res,
        404,
        responses.userTasksMessages.taskNotFound[language]
      );
    }
    await userTaskService.deleteUserTask(userTask.id);
    const userTasksAfterDelete = await userTaskService.fetchUserTasks(user_id);
    return handleSuccessResponse(res, 200, userTasksAfterDelete);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = deleteUserTask;
