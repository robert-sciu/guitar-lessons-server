const {
  handleErrorResponse,
  handleSuccessResponse,
  checkMissingUpdateData,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userTaskService = require("./userTaskService");
const responses = require("../../responses");

async function updateUserTask(req, res) {
  const language = req.language;
  if (req.user.role !== "admin") {
    return handleErrorResponse(res, 403, "Access denied");
  }
  const { user_id, task_id, is_completed } =
    userTaskService.destructureUpdateUserTaskCompletedData(req.body);

  try {
    const userTask = await userTaskService.findUserTask(user_id, task_id);
    if (!userTask) {
      return handleErrorResponse(
        res,
        404,
        responses.userTasksMessages.taskNotFound[language]
      );
    }
    if (
      checkMissingUpdateData(
        unchangedDataToUndefined(userTask, { is_completed })
      )
    ) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.noUpdateData[language]
      );
    }
    const updatedRecordCount = await userTaskService.updateUserTask(
      userTask.id,
      {
        is_completed,
      }
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    return handleSuccessResponse(
      res,
      200,
      responses.commonMessages.updateSuccess[language]
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = updateUserTask;
