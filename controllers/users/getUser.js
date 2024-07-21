const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");

async function getUser(req, res) {
  const id = req.query.id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { password, ...userData } = user.dataValues;
  return res.status(200).json({ success: true, userData });
}

module.exports = getUser;
