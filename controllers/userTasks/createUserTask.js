const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userTaskService = require("./userTaskService");
const responses = require("../../responses");
async function createUserTask(req, res) {
  const language = req.language;
  const user_id = req.user.id;
  const { task_id } = userTaskService.destrucureCreateUserTaskData(req.body);
  const data = { task_id, user_id };
  try {
    const task = await userTaskService.findTaskById(task_id);
    if (!task) {
      return handleErrorResponse(
        res,
        404,
        responses.userTasksMessages.taskNotFound[language]
      );
    }
    const existingUserTask = await userTaskService.findUserTask(
      user_id,
      task_id
    );
    if (existingUserTask) {
      return handleErrorResponse(
        res,
        409,
        responses.userTasksMessages.userTaskAlreadyExists[language]
      );
    }
    await userTaskService.createUserTask(data);
    const allUserTasks = await userTaskService.fetchUserTasks(user_id);
    return handleSuccessResponse(res, 201, allUserTasks);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = createUserTask;
