const { UserTask } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function updateUserTaskNotes(req, res, next) {
  const { user_id, task_id, user_notes } = req.body;
  const userTask = await UserTask.findOne({ where: { user_id, task_id } });
  if (!userTask) {
    return res
      .status(404)
      .json({ success: false, message: "User task not found" });
  }
  try {
    await userTask.update({ user_notes });
    return res
      .status(200)
      .json({ success: true, message: "User task updated successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = updateUserTaskNotes;
