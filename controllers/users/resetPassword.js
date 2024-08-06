const User = require("../../models").sequelize.models.User;
const bcrypt = require("bcryptjs");
const logger = require("../../utilities/logger");
const {
  findRecordByValue,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
  destructureData,
} = require("../../utilities/controllerUtilites");

async function resetPassword(req, res) {
  const data = destructureData(req.body, [
    "email",
    "password",
    "reset_password_token",
  ]);
  const { email, password, reset_password_token } = data;
  try {
    const user = await findRecordByValue(User, { email });
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }
    if (user.reset_password_token !== reset_password_token) {
      return handleErrorResponse(res, 400, "Invalid token");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedRecordCount = await updateRecord(
      User,
      {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_token_expiry: null,
      },
      user.id
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(res, 409, "Update failed");
    }
    return handleSuccessResponse(res, 200, "Password updated successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = resetPassword;
