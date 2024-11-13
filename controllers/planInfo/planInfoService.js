const {
  findRecordByFk,
  destructureData,
  findAllRecords,
  updateRecord,
} = require("../../utilities/controllerUtilites");

const { PlanInfo } = require("../../models").sequelize.models;
const { Op } = require("sequelize");
const config = require("../../config/config")[process.env.NODE_ENV];
const moment = require("moment-timezone");

class PlanInfoService {
  userIsAdmin(user) {
    return user.role === "admin";
  }

  getStartAndEndHoursUTC(updateData, timezone) {
    if (updateData.has_permanent_reservation !== true) {
      return;
    }
    const {
      permanent_reservation_hour,
      permanent_reservation_minute,
      permanent_reservation_lesson_duration,
    } = updateData;
    const hoursToAdd = Math.floor(permanent_reservation_lesson_duration / 60);
    const minutesToAdd = permanent_reservation_lesson_duration % 60;
    const endHour = permanent_reservation_hour + hoursToAdd;
    const endMinute = permanent_reservation_minute + minutesToAdd;

    const momentStartHour = moment.tz(
      `${permanent_reservation_hour}:${permanent_reservation_minute}`,
      "HH:mm",
      timezone
    );
    const momentEndHour = moment.tz(
      `${endHour}:${endMinute}`,
      "HH:mm",
      timezone
    );
    const permanent_reservation_start_hour_UTC = momentStartHour
      .utc()
      .format("HH:mm");
    const permanent_reservation_end_hour_UTC = momentEndHour
      .utc()
      .format("HH:mm");
    return {
      permanent_reservation_start_hour_UTC,
      permanent_reservation_end_hour_UTC,
    };
  }
  async getPlanInfo(user_id) {
    return await findRecordByFk(PlanInfo, user_id);
  }

  async getAllPlanInfos() {
    return await findAllRecords(PlanInfo);
  }

  async findConflictingPermanentReservations(user_id, updateData) {
    return await PlanInfo.findAll({
      where: {
        user_id: { [Op.ne]: user_id },
        permanent_reservation_weekday: {
          [Op.eq]: updateData.permanent_reservation_weekday,
        },
        [Op.and]: {
          permanent_reservation_start_hour_UTC: {
            [Op.lte]: updateData.permanent_reservation_end_hour_UTC,
          },
          permanent_reservation_end_hour_UTC: {
            [Op.gte]: updateData.permanent_reservation_start_hour_UTC,
          },
        },
      },
    });
  }

  async updatePlanInfo(user_id, updateData) {
    return await updateRecord(PlanInfo, updateData, user_id);
  }

  getUpdateDataForCancellingPermanentReservation() {
    const additionalData = {};
    additionalData.permanent_reservation_weekday = null;
    additionalData.permanent_reservation_start_hour_UTC = null;
    additionalData.permanent_reservation_end_hour_UTC = null;
    additionalData.permanent_reservation_lesson_duration = null;
    return { additionalData };
  }

  calculatePermanentPlanDiscount(updateData) {
    let discount;
    if (updateData.has_permanent_reservation === true) {
      discount = config.config.planInfo.permanentPlanDiscountPercent;
    } else if (updateData.has_permanent_reservation === false) {
      discount = 0;
    }
    return discount;
  }

  destructurePlanInfoUpdateData(data) {
    return destructureData(data, [
      "has_permanent_reservation",
      "permanent_reservation_weekday",
      "permanent_reservation_hour",
      "permanent_reservation_minute",
      "permanent_reservation_lesson_duration",
      "permanent_reservation_lesson_count",
      "reschedules_left_count",
      "special_discount",
    ]);
  }
}

const planInfoService = new PlanInfoService();

module.exports = planInfoService;
