const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ success: false, message: "Server error" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username: name,
      email,
      password: hashedPassword,
      role,
      difficulty_clearance_level: role === "admin" ? 999 : 0,
      is_confirmed: role === "admin" ? true : false,
    };

    const isCreateAdminUserEnabled =
      process.env.CREATE_ADMIN_USER_ENABLED === "true";

    if (role === "admin" && !isCreateAdminUserEnabled) {
      return res
        .status(400)
        .json({ success: false, message: "Creating admin user is disabled" });
    }

    await User.create(user);

    return res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ success: false, message: "Server error" });
  }
}

module.exports = createUser;
