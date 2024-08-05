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
} = require("../../utilities/controllerUtilites");

async function updateTask(req, res) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;
  const id = req.query.id;
  const { url, ...updateData } = req.body;
  const file = req.file || undefined;
  const filteredUrl = url ? filterURL(url) : undefined;
  updateData.url = filteredUrl;
  const transaction = await sequelize.transaction();
  if (checkMissingUpdateData(updateData) && file === undefined) {
    await transaction.rollback();
    return handleErrorResponse(res, 400, "No update data provided");
  }
  try {
    const task = await findRecordByPk(Task, id, transaction);
    if (!task) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "Task not found");
    }
    if (file) {
      try {
        if (task?.filename) {
          await s3Manager.deleteFileFromS3(
            bucketName,
            tasksPath,
            task.filename
          );
        }
        await s3Manager.uploadFileToS3(bucketName, tasksPath, file);
        updateData.filename = file.originalname;
      } catch (error) {
        await transaction.rollback();
        logger.error(error);
        return handleErrorResponse(res, 500, "Server error");
      }
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
    await transaction.commit();
    return handleSuccessResponse(res, 200, "Task updated successfully");
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateTask;
