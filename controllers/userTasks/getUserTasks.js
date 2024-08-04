const {
  findRecordByPk,
  handleErrorResponse,
  findAllRecords,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const { UserTask, User } = require("../../models").sequelize.models;

async function getUserTasks(req, res) {
  const id = req.query.user_id;
  const user_id = id;
  try {
    if (!(await findRecordByPk(User, id))) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const userTasks = await findAllRecords(UserTask, user_id);
    if (userTasks.length < 1) {
      return handleErrorResponse(res, 404, "No user tasks found");
    }
    return handleSuccessResponse(res, 200, userTasks);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getUserTasks;
