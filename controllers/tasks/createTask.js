const Task = require("../../models").sequelize.models.Task;
const {
  handleErrorResponse,
  findRecordByValue,
  createRecord,
  handleSuccessResponse,
  checkMissingUpdateData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");
const { filterURL } = require("../../utilities/utilities");

async function createTask(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;
  // data = { artist, notes_pl, notes_en, difficulty_level };
  const { url, title, ...data } = req.body;
  const file = req.file || undefined;
  const filteredUrl = url ? filterURL(url) : undefined;
  // validator already checks for optional and non optional values but with almost all values optional we need to check if we have
  // at least one key value for task to make sense. In this case url or file.
  // if (!url && !file) {
  if (checkMissingUpdateData({ url, file })) {
    return handleErrorResponse(res, 400, "Missing required fields");
  }
  try {
    if (file) {
      if (await s3Manager.checkIfFileExists(bucketName, tasksPath, file)) {
        return handleErrorResponse(res, 409, "File already exists");
      }
    }
    // const existingTask = await Task.findOne({ where: { title } });
    if (await findRecordByValue(Task, { title })) {
      return handleErrorResponse(res, 409, "Task already exists");
    }
    if (file) {
      await s3Manager.uploadFileToS3(bucketName, tasksPath, file);
    }
    await createRecord(Task, {
      title,
      url: filteredUrl,
      filename: file?.originalname,
      ...data,
    });

    handleSuccessResponse(res, 201, "Task created successfully");
  } catch (error) {
    logger.error(error);
    handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createTask;
