const Task = require("../../models").sequelize.models.Task;
const { sequelize } = require("../../models");
const {
  handleErrorResponse,
  findRecordByValue,
  createRecord,
  handleSuccessResponse,
  checkMissingUpdateData,
  destructureData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");
const { filterURL } = require("../../utilities/utilities");

async function createTask(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;
  const data = destructureData(req.body, [
    "artist",
    "title",
    "url",
    "notes_pl",
    "notes_en",
    "difficulty_level",
  ]);
  const { url, title } = data;
  const file = req.file || undefined;
  const filteredUrl = url ? filterURL(url) : undefined;
  if (filteredUrl) {
    data.url = filteredUrl;
  }
  const transaction = await sequelize.transaction();

  // validator already checks for optional and non optional values but with almost all values optional we need to check if we have
  // at least one key value for task to make sense. In this case url or file.
  // if (!url && !file) {
  if (checkMissingUpdateData({ url, file })) {
    await transaction.rollback();
    return handleErrorResponse(res, 400, "Missing required fields");
  }
  try {
    if (file) {
      if (await s3Manager.checkIfFileExists(bucketName, tasksPath, file)) {
        await transaction.rollback();
        return handleErrorResponse(res, 409, "File already exists");
      }
    }
    // const existingTask = await Task.findOne({ where: { title } });
    if (await findRecordByValue(Task, { title }, transaction)) {
      await transaction.rollback();
      return handleErrorResponse(res, 409, "Task already exists");
    }
    if (file) {
      await s3Manager.uploadFileToS3(bucketName, tasksPath, file);
    }
    await createRecord(
      Task,
      {
        ...data,
        filename: file?.originalname,
      },
      transaction
    );
    await transaction.commit();

    return handleSuccessResponse(res, 201, "Task created successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createTask;
