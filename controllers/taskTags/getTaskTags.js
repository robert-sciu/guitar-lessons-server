const { TaskTag } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");
const { Op } = require("sequelize");

async function getTaskTags(req, res) {
  const tasksDifficultyLevel = req.body.difficulty_clearance_level;

  try {
    const taskTags = await TaskTag.findAll({
      where: { task_difficulty_level: { [Op.lte]: tasksDifficultyLevel } },
    });

    if (taskTags.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "No task tags found" });
    }
    return res.status(200).json({ success: true, taskTags });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
module.exports = getTaskTags;
