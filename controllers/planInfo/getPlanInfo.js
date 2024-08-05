const { PlanInfo, User } = require("../../models").sequelize.models;
const {
  findRecordByFk,
  handleErrorResponse,
  handleSuccessResponse,
  findRecordByPk,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getPlanInfo(req, res) {
  const user_id = req.body.user_id;
  try {
    if (!findRecordByPk(User, user_id)) {
      return handleErrorResponse(res, 404, "User not found");
    }
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