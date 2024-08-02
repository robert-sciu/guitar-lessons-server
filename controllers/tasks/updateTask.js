const s3Manager = require("../../utilities/s3Manager");
const { filterURL } = require("../../utilities/utilities");

const Task = require("../../models").sequelize.models.Task;

async function updateTask(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;

  const { title, artist, url, notes, difficulty_level } = req.body;
  const id = req.query.id;

  const file = req.file || undefined;
  const filteredUrl = url ? filterURL(url) : undefined;

  const updateData = {
    title,
    artist,
    url: filteredUrl,
    notes,
    difficulty_level,
  };

  const noValues = Object.values(updateData).filter(
    (value) => value === undefined
  );

  if (
    noValues.length === Object.values(updateData).length &&
    file === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "No update data provided" });
  }

  try {
    const task = await Task.findOne({ where: { id } });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    if (file) {
      if (task?.filename) {
        await s3Manager.deleteFileFromS3(bucketName, tasksPath, task.filename);
      }
      await s3Manager.uploadFileToS3(bucketName, tasksPath, file);
      updateData.filename = file.originalname;
    }

    await task.update(updateData, { where: { id } });

    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = updateTask;
