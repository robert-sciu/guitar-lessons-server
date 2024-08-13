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
  const file = req.file;
  if (url) {
    data.url = filterURL(url);
  }
  if (file) {
    data.filename = file.originalname;
  }
  const transaction = await sequelize.transaction();
  try {
    if (await findRecordByValue(Task, { title }, transaction)) {
      await transaction.rollback();
      return handleErrorResponse(res, 409, "Task already exists");
    }
    // const existingTask = await Task.findOne({ where: { title } });
    const taskRecord = await createRecord(Task, data, transaction);
    if (!taskRecord) {
      await transaction.rollback();
      return handleErrorResponse(res, 500, "Server error");
    }
    if (file) {
      const filePath = `${tasksPath}/${file.originalname}`;
      if (await s3Manager.checkIfFileExists(bucketName, filePath)) {
        await transaction.rollback();
        return handleErrorResponse(res, 409, "File already exists");
      }
      await s3Manager.uploadFileToS3(bucketName, tasksPath, file);
    }
    await transaction.commit();
    return handleSuccessResponse(res, 201, "Task created successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createTask;
