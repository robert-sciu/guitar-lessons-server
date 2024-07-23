const transporter = require("../../utilities/mailer");
const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");
const crypto = require("crypto");

async function resetPassword(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomInt(1000, 9999);
    const resetTokenExpiry = Date.now() + 60 * 15 * 1000;

    await user.update({
      reset_password_token: resetToken,
      reset_password_token_expiry: resetTokenExpiry,
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Password",
      text: `Your reset token is: ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Password reset token sent" });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ success: false, message: "Server error" });
  }
}

module.exports = resetPassword;
