const { TaskTag } = require("../../models").sequelize.models;
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const { Op } = require("sequelize");

async function getTaskTags(req, res) {
  const tasksDifficultyLevel = req.body.difficulty_clearance_level;
  try {
    const taskTags = await TaskTag.findAll({
      where: { task_difficulty_level: { [Op.lte]: tasksDifficultyLevel } },
    });
    if (taskTags.length < 1) {
      return handleErrorResponse(res, 404, "No task tags found");
    }
    return handleSuccessResponse(res, 200, taskTags);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}
module.exports = getTaskTags;
