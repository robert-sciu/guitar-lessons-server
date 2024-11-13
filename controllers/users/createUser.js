const { sequelize } = require("../../models");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userService = require("./userService");
const responses = require("../../responses");

async function createUser(req, res) {
  const language = req.language;
  const data = userService.destructureCreateUserData(req.body);
  const role = data.role;
  const transaction = await sequelize.transaction();
  try {
    if (await userService.emailIsInDatabase(data.email, transaction)) {
      await transaction.rollback();
      return handleErrorResponse(
        res,
        409,
        responses.usersMessages.mailInUse[language]
      );
    }
    const hashedPassword = await userService.hashPassword(data.password);
    const userData = {
      ...data,
      password: hashedPassword,
      difficulty_clearance_level: role === "admin" ? 999 : 0,
      is_confirmed: role === "admin" ? true : false,
    };
    const createAdminUserIsEnabled =
      process.env.CREATE_ADMIN_USER_ENABLED === "true";
    if (role === "admin" && !createAdminUserIsEnabled) {
      await transaction.rollback();
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.forbidden[language]
      );
    }
    const newUser = await userService.createUser(userData, transaction);
    const user_id = newUser.id;
    await userService.createPlanInfo(user_id, transaction);
    await transaction.commit();
    return handleSuccessResponse(
      res,
      200,
      responses.usersMessages.userCreated[language]
    );
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = createUser;
