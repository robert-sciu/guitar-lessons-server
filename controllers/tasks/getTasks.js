const { Task, Tag } = require("../../models").sequelize.models;
const { Op } = require("sequelize");
const logger = require("../../utilities/logger");
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

async function getTasks(req, res) {
  const id = req.query.id;

  const { difficulty_clearance_level } = req.user;
  console.log(difficulty_clearance_level);

  try {
    if (id) {
      const task = await findRecordByPk(Task, id);
      if (!task) {
        return handleErrorResponse(res, 404, "Task not found");
      }
      if (task.difficulty_level > difficulty_clearance_level) {
        return handleErrorResponse(res, 403, "Task not available yet");
      }
      return handleSuccessResponse(res, 200, task);
    }
    const tasks = await Task.findAll({
      where: { difficulty_level: { [Op.lte]: difficulty_clearance_level } },
      include: [
        {
          model: Tag,
          through: { attributes: [] },
        },
      ],
    });
    console.log(tasks);

    if (tasks.length < 1) {
      return handleErrorResponse(res, 404, "No tasks found");
    }
    return handleSuccessResponse(res, 200, tasks);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getTasks;
