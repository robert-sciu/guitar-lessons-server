const { Task, Tag, UserTask, User } = require("../../models").sequelize.models;
// const db = require("../../models");
// const sequelize = require("../../models").sequelize;
const { Op, where } = require("sequelize");
const logger = require("../../utilities/logger");
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

async function getTasks(req, res) {
  const id = req.query.id;
  const user_id = req.user.id;

  const { difficulty_clearance_level } = req.user;

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
      include: [
        {
          model: User,
          through: { attributes: [] },
          where: { id: user_id }, // exclude tasks associated with the user
          required: false, // use LEFT JOIN
          attributes: [], // exclude user data
        },
        {
          model: Tag,
          through: { attributes: [] },
        },
      ],
      where: {
        difficulty_level: { [Op.lte]: difficulty_clearance_level },
        "$Users.id$": null,
      },
    });

    // if (tasks.length < 1) {
    //   return handleErrorResponse(res, 404, "No tasks found");
    // }
    return handleSuccessResponse(res, 200, tasks);
  } catch (error) {
    console.log(error);
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getTasks;
