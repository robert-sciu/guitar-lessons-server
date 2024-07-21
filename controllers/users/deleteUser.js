const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");

async function deleteUser(req, res) {
  const id = req.query.id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  try {
    await user.destroy();
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ success: false, message: "Server error" });
  }
}

module.exports = deleteUser;
