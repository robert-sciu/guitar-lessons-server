const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userTaskService = require("./userTaskService");
const responses = require("../../responses");
const {
  getUserBasedOnRole,
} = require("../../middleware/getUserBasedOnUserRole");

async function deleteUserTask(req, res, next) {
  const language = req.language;
  const taskId = req.id;
  const user = req.user;

  const userId =
    user.role === "admin" && req.query?.userId ? req.query.userId : user.id;

  try {
    const userTask = await userTaskService.findUserTask(userId, taskId);
    if (!userTask) {
      return handleErrorResponse(
        res,
        404,
        responses.userTasksMessages.taskNotFound[language]
      );
    }
    await userTaskService.deleteUserTask(userTask.id);
    // const userTasksAfterDelete = await userTaskService.fetchUserTasks(userId);
    return handleSuccessResponse(res, 204, null);
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
