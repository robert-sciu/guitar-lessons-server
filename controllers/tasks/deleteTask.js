const Task = require("../../models").sequelize.models.Task;
const { sequelize } = require("../../models");
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  deleteRecord,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const s3Manager = require("../../utilities/s3Manager");

async function deleteTask(req, res, next) {
  const bucketName = process.env.BUCKET_NAME;
  const tasksPath = process.env.BUCKET_TASKS_PATH;
  const id = req.query.id;
  const transaction = await sequelize.transaction();
  try {
    const task = await findRecordByPk(Task, id);
    if (!task) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "Task not found");
    }
    await deleteRecord(Task, id);
    if (task.filename) {
      const filePath = `${tasksPath}/${task.filename}`;
      await s3Manager.deleteFileFromS3(bucketName, filePath);
    }
    await transaction.commit();
    return handleSuccessResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteTask;
