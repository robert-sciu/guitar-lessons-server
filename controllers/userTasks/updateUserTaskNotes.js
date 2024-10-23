const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userTaskService = require("./userTaskService");
const responses = require("../../responses");

async function updateUserTaskNotes(req, res) {
  const language = req.language;
  const user_id = req.user.id;
  const { task_id, user_notes = "" } =
    userTaskService.destructureUpdateUserTaskNotesData(req.body);
  try {
    const userTask = await userTaskService.findUserTask(user_id, task_id);
    if (!userTask) {
      return handleErrorResponse(
        res,
        404,
        responses.userTasksMessages.taskNotFound[language]
      );
    }
    const updatedRecordCount = await userTaskService.updateUserTask(
      userTask.id,
      { user_notes }
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    return handleSuccessResponse(res, 200, {
      user_task_id: userTask.id,
      user_notes,
    });
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = updateUserTaskNotes;
