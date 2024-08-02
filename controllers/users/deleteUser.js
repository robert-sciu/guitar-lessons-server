const { User, PlanInfo } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const logger = require("../../utilities/logger");

async function deleteUser(req, res) {
  const id = req.query.id;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(id);
    if (!user) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const planInfo = await PlanInfo.findOne({ where: { user_id: id } });

    if (planInfo) {
      await planInfo.destroy();
    }
    await user.destroy();

    await transaction.commit();

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return res.status(400).json({ success: false, message: "Server error" });
  }
}

module.exports = deleteUser;
