const { sequelize } = require("../../models");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const userService = require("./userService");
const responses = require("../../responses");

async function createAdmin(req, res) {
  const language = req.language;
  const data = userService.destructureCreateUserDataAdmin(req.body);
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
      role: "admin",
      difficulty_clearance_level: 999,
      is_confirmed_by_admin: true,
      is_verified: true,
    };

    if (
      process.env.CREATE_ADMIN_USER_ENABLED !== "true" ||
      process.env.CREATE_ADMIN_TOKEN !== data.token
    ) {
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

module.exports = createAdmin;
