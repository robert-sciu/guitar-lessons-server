const Task = require("../../models").sequelize.models.Task;
const { Op } = require("sequelize");
const logger = require("../../utilities/logger");

async function getTasks(req, res) {
  const id = req.query.id;
  const { difficulty_clearance_level } = req.body;

  try {
    if (id) {
      const task = await Task.findOne({ where: { id } });
      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }
      if (task.difficulty_level > difficulty_clearance_level) {
        return res.status(403).json({
          success: false,
          message: "Task not available yet",
        });
      }
      return res.status(200).json({ success: true, task });
    }

    const tasks = await Task.findAll({
      where: { difficulty_level: { [Op.lte]: difficulty_clearance_level } },
    });

    if (tasks.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found" });
    }
    res.json({ success: true, tasks });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = getTasks;
