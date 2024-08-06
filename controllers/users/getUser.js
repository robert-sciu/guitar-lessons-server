const User = require("../../models").sequelize.models.User;
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  destructureData,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getUser(req, res) {
  const id = req.query.id;
  const user = await findRecordByPk(User, id);
  if (!user) {
    return handleErrorResponse(res, 404, "User not found");
  }
  // Remove password and reset_password_token from response
  const filteredUserData = destructureData(user.dataValues, [
    "id",
    "username",
    "email",
    "role",
    "difficulty_clearance_level",
    "is_confirmed",
  ]);
  return handleSuccessResponse(res, 200, filteredUserData);
}

module.exports = getUser;
