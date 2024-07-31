const User = require("../../models").sequelize.models.User;
const bcrypt = require("bcryptjs");
const logger = require("../../utilities/logger");

async function resetPassword(req, res, next) {
  const { email, password, reset_password_token } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.reset_password_token !== reset_password_token) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await user.update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_token_expiry: null,
    });

    if (updatedUser[0] === 0) {
      return res.status(404).json({ success: false, message: "Update failed" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = resetPassword;
