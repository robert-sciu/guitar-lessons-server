const transporter = require("../../utilities/mailer");
const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");
const crypto = require("crypto");
const {
  findRecordByValue,
  handleErrorResponse,
  updateRecord,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

async function resetPassword(req, res, next) {
  const { email } = req.body;
  try {
    const user = await findRecordByValue(User, { email });

    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const resetToken = crypto.randomInt(1000, 9999);
    const resetTokenExpiry = Date.now() + 60 * 15 * 1000;

    const updatedRecordCount = await updateRecord(
      User,
      {
        reset_password_token: resetToken,
        reset_password_token_expiry: resetTokenExpiry,
      },
      user.id
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(res, 409, "Update failed");
    }
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Password",
      text: `Your reset token is: ${resetToken}`,
    };
    await transporter.sendMail(mailOptions);
    return handleSuccessResponse(res, 200, "Password reset token sent");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = resetPassword;
