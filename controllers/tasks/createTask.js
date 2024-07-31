const Task = require("../../models").sequelize.models.Task;
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");
const { filterURL } = require("../../utilities/utilities");

async function createTask(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;

  const { title, artist, url, notes, difficulty_level } = req.body;

  const file = req.file || undefined;
  const filteredUrl = url ? filterURL(url) : undefined;

  // validator already checks for optional and non optional values but with almost all values optional we need to check if we have
  // at least one key value for task to make sense. In this case url or file.

  const optionalValues = [url, file];

  const noValues = optionalValues.filter((value) => value === undefined);

  if (noValues.length > optionalValues.length - 1) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    if (file) {
      const existingFile = await s3Manager.checkIfFileExists(
        bucketName,
        tasksPath,
        file
      );
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
      await s3Manager.uploadFileToS3(bucketName, tasksPath, file);
    }

    const task = await Task.create({
      title,
      artist,
      url: filteredUrl,
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
