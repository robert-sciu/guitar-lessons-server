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
      role: "user",
      difficulty_clearance_level: 1,
      is_active: false,
      is_verified: false,
    };

    const newUser = await userService.createUser(userData, transaction);
    const user_id = newUser.id;

    const verificationToken = userService.generateVerificationToken(user_id);

    await userService.createPlanInfo(user_id, transaction);
    await userService.saveVerificationToken(
      user_id,
      verificationToken,
      transaction
    );

    const verificationLink = `${
      process.env.Node_ENV === "production"
        ? process.env.PRODUCTION_ORIGIN
        : process.env.DEV_ORIGIN
    }/verifyUser?token=${verificationToken}`;

    const mailError = await userService.sendVerificationEmail(
      data.email,
      verificationLink,
      language
    );
    if (mailError) {
      await transaction.rollback();
      return handleErrorResponse(
        res,
        500,
        responses.commonMessages.serverError[language]
      );
    }
    await userService.sendMailToMyselfAboutNewUser(
      newUser.email,
      newUser.username
    );

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
