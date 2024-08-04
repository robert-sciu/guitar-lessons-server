const { User, PlanInfo } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  findRecordByValue,
  handleErrorResponse,
  handleSuccessResponse,
  createRecord,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
  const { username, email, password, role } = req.body;
  const transaction = await sequelize.transaction();
  try {
    if (await findRecordByValue(User, { email }, transaction)) {
      await transaction.rollback();
      return handleErrorResponse(res, 409, "User already exists");
    }
    const userData = {
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      difficulty_clearance_level: role === "admin" ? 999 : 0,
      is_confirmed: role === "admin" ? true : false,
    };
    const createAdminUserIsEnabled =
      process.env.CREATE_ADMIN_USER_ENABLED === "true";
    if (role === "admin" && !createAdminUserIsEnabled) {
      await transaction.rollback();
      return handleErrorResponse(res, 400, "Creating admin user is disabled");
    }
    const newUser = await createRecord(User, userData, transaction);
    const planInfoData = {
      user_id: newUser.id,
    };
    await createRecord(PlanInfo, planInfoData, transaction);
    await transaction.commit();
    return handleSuccessResponse(res, 200, "User created successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = createUser;
