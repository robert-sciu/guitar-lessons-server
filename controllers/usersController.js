const User = require("../models").sequelize.models.User;
const bcrypt = require("bcryptjs");
const logger = require("../utilities/logger");

async function getUser(req, res) {
  const id = req.query.id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { password, ...userData } = user.dataValues;
  return res.status(200).json({ success: true, userData });
}

async function createUser(req, res) {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username: name,
      email,
      password: hashedPassword,
      role,
      difficulty_clearance_level: 0,
      is_confirmed: false,
    };

    await User.create(user);
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ success: false });
  }
  return res
    .status(200)
    .json({ success: true, message: "User created successfully" });
}

async function updateUser(req, res) {
  const { user_id, difficulty_clearance_level, is_confirmed } = req.body;

  const userUpdateData = {
    difficulty_clearance_level,
    is_confirmed,
  };

  if (!user_id || typeof user_id !== "number" || Number(user_id) < 1) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  if (!difficulty_clearance_level && !is_confirmed) {
    return res
      .status(400)
      .json({ success: false, message: "No update data provided" });
  }

  if (
    typeof difficulty_clearance_level !== "number" ||
    Number(difficulty_clearance_level) < 0
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid difficulty clearance level" });
  }

  if (typeof is_confirmed !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid confirmation value" });
  }

  try {
    const update = await User.update(userUpdateData, {
      where: {
        id: user_id,
      },
    });

    if (update[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ success: false });
  }
  return res
    .status(200)
    .json({ success: true, message: "User updated successfully" });
}

module.exports = { getUser, createUser, updateUser };
