const { User } = require("../../models").sequelize.models;
const {
  handleErrorResponse,
  handleSuccessResponse,
  destructureData,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");
const responses = require("../../responses");

async function getUser(req, res) {
  const language = req.language;
  const user = req.user;
  if (user.role === "admin") {
    try {
      const users = await findAllRecords(User);
      if (!users) {
        return handleErrorResponse(res, 404, "No users found");
      }
      const filteredUsers = users.map((user) =>
        destructureData(user, [
          "id",
          "username",
          "email",
          "difficulty_clearance_level",
          "is_confirmed",
        ])
      );
      return handleSuccessResponse(res, 200, filteredUsers);
    } catch (error) {
      logger.error(error);
      return handleErrorResponse(
        res,
        500,
        responses.commonMessages.serverError[language]
      );
    }
  }
  return handleSuccessResponse(res, 200, user);
}

module.exports = getUser;
