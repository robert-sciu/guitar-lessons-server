const User = require("../../models").sequelize.models.User;
const {
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const logger = require("../../utilities/logger");

async function getUser(req, res) {
  const id = req.query.id;
  const user = await findRecordByPk(User, id);
  if (!user) {
    return handleErrorResponse(res, 404, "User not found");
  }
  // Remove password and reset_password_token from response
  const {
    password,
    reset_password_token,
    reset_password_token_expiry,
    ...userData
  } = user.dataValues;
  return handleSuccessResponse(res, 200, userData);
}

module.exports = getUser;
