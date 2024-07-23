const Task = require("../../models").sequelize.models.Task;

async function getTasks(req, res) {
  const id = req.query.id;
  try {
    if (id) {
      const task = await Task.findOne({ where: { id } });
      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }
      return res.status(200).json({ success: true, task });
    }

    const tasks = await Task.findAll();

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
