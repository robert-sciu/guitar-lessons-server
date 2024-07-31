const { User, Task, UserTask } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function createUserTask(req, res) {
  const { user_id, task_id, user_notes } = req.body;
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const task = await Task.findByPk(task_id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const userTask = await UserTask.findOne({
      where: { user_id, task_id },
    });

    if (userTask) {
      return res
        .status(409)
        .json({ success: false, message: "User task already exists" });
    }

    await UserTask.create({
      user_id,
      task_id,
      user_notes,
      is_completed: false,
    });

    return res
      .status(201)
      .json({ success: true, message: "User task created successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = createUserTask;
