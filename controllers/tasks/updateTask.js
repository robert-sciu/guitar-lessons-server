const s3Manager = require("../../utilities/s3Manager");
const { filterURL } = require("../../utilities/utilities");
const Task = require("../../models").sequelize.models.Task;
const { sequelize } = require("../../models");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  findRecordByPk,
  updateRecord,
  handleSuccessResponse,
  destructureData,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");

async function updateTask(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;
  const id = req.query.id;
  const updateData = destructureData(req.body, [
    "title",
    "artist",
    "url",
    "notes_pl",
    "notes_en",
    "difficulty_level",
  ]);
  const { url } = updateData;
  const file = req.file;
  if (url) {
    updateData.url = filterURL(url);
  }
  if (file) {
    updateData.filename = file.originalname;
  }
  const transaction = await sequelize.transaction();
  try {
    const task = await findRecordByPk(Task, id, transaction);
    if (!task) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "Task not found");
    }
    const updateDataNoDuplicates = unchangedDataToUndefined(task, updateData);
    if (checkMissingUpdateData(updateDataNoDuplicates) && file === undefined) {
      await transaction.rollback();
      return handleErrorResponse(res, 400, "No update data provided");
    }
    const updatedRowsCount = await updateRecord(
      Task,
      updateData,
      id,
      transaction
    );
    if (updatedRowsCount === 0) {
      await transaction.rollback();
      return handleErrorResponse(res, 409, "Task not updated");
    }
    if (file) {
      if (task.filename) {
        const filePath = `${tasksPath}/${task.filename}`;
        await s3Manager.deleteFileFromS3(bucketName, filePath);
      }
      await s3Manager.uploadFileToS3(bucketName, tasksPath, file);
    }
    await transaction.commit();
    return handleSuccessResponse(res, 200, "Task updated successfully");
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateTask;
