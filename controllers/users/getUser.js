const { User } = require("../../models").sequelize.models;
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  destructureData,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getUser(req, res) {
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
      return handleErrorResponse(res, 500, "Internal server error");
    }
  }
  return handleSuccessResponse(res, 200, user);
}

module.exports = getUser;
