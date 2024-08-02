const { PlanInfo } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function updatePlanInfo(req, res) {
  const {
    user_id,
    has_permanent_reservation,
    permanent_reservation_weekday,
    permanent_reservation_hour,
    permanent_reservation_lesson_length,
    permanent_reservation_lesson_count,
    permanent_discount,
  } = req.body;

  const updateData = {
    has_permanent_reservation,
    permanent_reservation_weekday,
    permanent_reservation_hour,
    permanent_reservation_lesson_length,
    permanent_reservation_lesson_count,
    permanent_discount,
  };

  const noValues = Object.values(updateData).filter((value) => {
    value === undefined && value !== user_id;
  });

  if (noValues.length === Object.values(updateData).length) {
    return res
      .status(400)
      .json({ success: false, message: "No update data provided" });
  }

  try {
    const planInfo = await PlanInfo.findOne({ where: { user_id } });

    if (!planInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Plan info not found" });
    }

    const updatePlanInfo = await planInfo.update(updateData);

    if (updatePlanInfo[0] === 0) {
      return res.status(404).json({ success: false, message: "Update failed" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Plan info updated successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = updatePlanInfo;
