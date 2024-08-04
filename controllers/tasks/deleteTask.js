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
  const id = req.query.id;
  const transaction = await sequelize.transaction();
  try {
    const task = await findRecordByPk(Task, id);
    if (!task) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "Task not found");
    }
    if (task.filename) {
      try {
        await s3Manager.deleteFileFromS3(
          process.env.BUCKET_NAME,
          process.env.BUCKET_TASKS_PATH,
          task.filename
        );
      } catch (error) {
        logger.error(error);
        await transaction.rollback();
        return handleErrorResponse(res, 500, "Server error");
      }
    }
    await deleteRecord(Task, id);
    await transaction.commit();
    return handleSuccessResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteTask;
