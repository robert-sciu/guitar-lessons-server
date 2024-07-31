const { UserTask, User } = require("../../models").sequelize.models;

async function getUserTasks(req, res) {
  const id = req.query.user_id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const userTasks = await UserTask.findAll({ where: { user_id: id } });

  if (userTasks.length < 1) {
    return res
      .status(404)
      .json({ success: false, message: "No user tasks found" });
  }

  res.json({ success: true, userTasks });
}

module.exports = getUserTasks;
