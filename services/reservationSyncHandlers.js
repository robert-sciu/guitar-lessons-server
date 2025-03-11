const { LessonReservation } = require("../models").sequelize.models;
const logger = require("../utilities/logger");
const { Op } = require("sequelize");

async function removeReservationsOlderThanMonth() {
  try {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    await LessonReservation.destroy({
      where: {
        start_UTC: {
          [Op.lt]: monthAgo,
        },
      },
    });
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  removeReservationsOlderThanMonth,
};
