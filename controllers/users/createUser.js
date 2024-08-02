const { User, PlanInfo } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const logger = require("../../utilities/logger");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
  const { username, email, password, role } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
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
      username,
      email,
      password: hashedPassword,
      role,
      difficulty_clearance_level: role === "admin" ? 999 : 0,
      is_confirmed: role === "admin" ? true : false,
    };

    const isCreateAdminUserEnabled =
      process.env.CREATE_ADMIN_USER_ENABLED === "true";

    if (role === "admin" && !isCreateAdminUserEnabled) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Creating admin user is disabled" });
    }

    const newUser = await User.create(user, { transaction });

    const defaultPlanInfo = {
      user_id: newUser.id,
      has_permanent_reservation: false,
      permanent_reservation_weekday: null,
      permanent_reservation_hour: null,
      permanent_reservation_lesson_count: null,
      regular_discount: 0,
      permanent_discount: null,
    };

    await PlanInfo.create(defaultPlanInfo, { transaction });

    await transaction.commit();

    return res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = createUser;
