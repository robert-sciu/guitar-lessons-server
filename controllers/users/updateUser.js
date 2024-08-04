const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
} = require("../../utilities/controllerUtilites");

async function updateUser(req, res) {
  const { user_id, difficulty_clearance_level, is_confirmed } = req.body;

  const userUpdateData = {
    difficulty_clearance_level,
    is_confirmed,
  };

  const missingUpdateData = checkMissingUpdateData(userUpdateData);

  if (missingUpdateData) {
    return res
      .status(400)
      .json({ success: false, message: "No update data provided" });
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

    return res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = updateUser;
