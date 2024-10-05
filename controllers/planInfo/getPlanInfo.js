const { PlanInfo, User } = require("../../models").sequelize.models;
const {
  findRecordByFk,
  handleErrorResponse,
  handleSuccessResponse,
  findRecordByPk,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getPlanInfo(req, res) {
  const user_id = req.user.id;
  try {
    const planInfo = await findRecordByFk(PlanInfo, user_id);
    if (!planInfo) {
      return handleErrorResponse(res, 404, "Plan info not found");
    }
    return handleSuccessResponse(res, 200, planInfo);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = getPlanInfo;
