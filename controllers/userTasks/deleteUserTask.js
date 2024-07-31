const { UserTask } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function deleteUserTask(req, res, next) {
  const id = req.query.id;

  const userTask = await UserTask.findByPk(id);

  if (!userTask) {
    return res
      .status(404)
      .json({ success: false, message: "User task not found" });
  }
  try {
    await userTask.destroy();
    return res
      .status(200)
      .json({ success: true, message: "User task deleted successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = deleteUserTask;
