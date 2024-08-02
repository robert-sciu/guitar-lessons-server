const { PlanInfo } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function getPlanInfo(req, res) {
  const id = req.query.id;
  try {
    const planInfo = await PlanInfo.findOne({ where: { user_id: id } });
    if (!planInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Plan info not found" });
    }
    res.status(200).json({ success: true, planInfo });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = getPlanInfo;
