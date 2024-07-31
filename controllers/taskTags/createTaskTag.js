const { Task, Tag, TaskTag } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function createTaskTag(req, res) {
  const { task_id: taskId, tag_id: tagId } = req.body;
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    const taskDifficultyLevel = task.difficulty_level;

    await TaskTag.create({
      task_id: taskId,
      tag_id: tagId,
      task_difficulty_level: taskDifficultyLevel,
    });

    return res
      .status(201)
      .json({ success: true, message: "Task tag created successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = createTaskTag;
