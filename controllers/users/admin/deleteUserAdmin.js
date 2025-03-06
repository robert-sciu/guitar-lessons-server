const { sequelize } = require("../../../models");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../../utilities/controllerUtilites");
const logger = require("../../../utilities/logger");
const responses = require("../../../responses");
const userService = require("../userService");

async function deleteUserAdmin(req, res) {
  const language = req.language;
  const id = req.id;

  const transaction = await sequelize.transaction();
  try {
    const user = await userService.findUserById(id, transaction);
    if (!user) {
      await transaction.rollback();
      return handleErrorResponse(
        res,
        404,
        responses.usersMessages.userNotFound[language]
      );
    }
    await userService.deletePlanInfo(id, transaction);

    await userService.deleteAllTokensForUser(id, transaction);

    await userService.deleteUserReservations(id, transaction);

    await userService.deleteUserTasks(id, transaction);

    await userService.deleteUser(id, transaction);

    await transaction.commit();

    return handleSuccessResponse(
      res,
      200,
      responses.usersMessages.userDeleted[language]
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

module.exports = deleteUserAdmin;
