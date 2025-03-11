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

async function getUserTasks(req, res) {
  const language = req.language;
  const user = await getUserBasedOnRole(req);
  const user_id = user.id;
  try {
    const allUserTasks = await userTaskService.fetchUserTasks(user_id);
    return handleSuccessResponse(res, 200, allUserTasks);
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
