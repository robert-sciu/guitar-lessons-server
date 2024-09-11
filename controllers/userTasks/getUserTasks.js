const {
  findRecordByPk,
  handleErrorResponse,
  findAllRecords,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

const { User, Task, Tag } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function getUserTasks(req, res) {
  const id = req.user.id;
  try {
    if (!(await findRecordByPk(User, id))) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const tasks = await User.findOne({
      where: { id },
      include: [
        {
          model: Task,
          through: { attributes: ["id", "user_notes", "is_completed"] },
          include: [
            {
              model: Tag,
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!tasks) {
      return handleErrorResponse(res, 404, "No user tasks found");
    }
    return handleSuccessResponse(res, 200, tasks);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getUserTasks;
