const { User, Task, UserTask } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  findRecordByFk,
  createRecord,
  handleSuccessResponse,
  destructureData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function createUserTask(req, res) {
  const data = destructureData(req.body, ["task_id", "user_notes"]);
  data.user_id = req.user.id;
  const { task_id, user_id } = data;
  try {
    const user = await findRecordByPk(User, user_id);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const task = await findRecordByPk(Task, task_id);
    if (!task) {
      return handleErrorResponse(res, 404, "Task not found");
    }
    const existingUserTask = await findRecordByFk(UserTask, {
      user_id,
      task_id,
    });
    if (existingUserTask) {
      return handleErrorResponse(res, 409, "User task already exists");
    }
    const userTask = await createRecord(UserTask, data);

    const sendData = { ...task.dataValues, UserTask: userTask };

    return handleSuccessResponse(res, 201, sendData);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createUserTask;
