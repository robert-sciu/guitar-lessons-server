const { User, PlanInfo } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  findRecordByPk,
  handleErrorResponse,
  findRecordByFk,
  deleteRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function deleteUser(req, res) {
  const id = req.query.id;
  const transaction = await sequelize.transaction();
  try {
    const user = await findRecordByPk(User, id, transaction);
    if (!user) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "User not found");
    }
    if (!(await findRecordByFk(PlanInfo, user.id, transaction))) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "Plan info not found");
    }
    await deleteRecord(PlanInfo, user.id, transaction);
    await deleteRecord(User, id, transaction);
    await transaction.commit();
    return handleSuccessResponse(res, 200, "User deleted successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = deleteUser;
