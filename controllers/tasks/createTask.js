const Task = require("../../models").sequelize.models.Task;
const logger = require("../../utilities/logger");
const { checkIfFileExists } = require("../../utilities/minioS3Uploader");
const { uploadFileToS3 } = require("../../utilities/s3Uploader");

async function createTask(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;

  const { title, artist, url, notes, difficulty_level } = req.body;

  const file = req.file || null;

  try {
    if (file) {
      const existingFile = await checkIfFileExists(bucketName, tasksPath, file);
      if (existingFile) {
        return res
          .status(400)
          .json({ success: false, message: "File already exists" });
      }
    }

    const existingTask = await Task.findOne({ where: { title } });

    if (existingTask) {
      return res
        .status(400)
        .json({ success: false, message: "Task already exists" });
    }

    if (file) {
      await uploadFileToS3(bucketName, tasksPath, file);
    }

    const task = await Task.create({
      title,
      artist,
      url,
      filename: file?.originalname,
      notes,
      difficulty_level,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

module.exports = createTask;
