const Task = require("../../models").sequelize.models.Task;
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");

async function deleteTask(req, res, next) {
  const id = req.query.id;

  try {
    const task = await Task.findOne({ where: { id } });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.filename) {
      await s3Manager.deleteFileFromS3(
        process.env.BUCKET_NAME,
        process.env.BUCKET_TASKS_PATH,
        task.filename
      );
    }

    await task.destroy();

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ success: false, message: "Server error" });
  }
}

module.exports = deleteTask;
