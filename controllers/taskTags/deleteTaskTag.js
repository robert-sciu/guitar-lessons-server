const { TaskTag } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function deleteTaskTag(req, res) {
  const { id } = req.query;

  try {
    const taskTag = await TaskTag.findOne({ where: { id } });
    if (!taskTag) {
      return res
        .status(404)
        .json({ success: false, message: "Task tag not found" });
    }
    await taskTag.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Task tag deleted successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = deleteTaskTag;
