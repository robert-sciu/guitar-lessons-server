const planInfoData = {
  invalidIdList: ["string", undefined, null, 0, NaN, true, false],
};

const updatePlanInfoData = {
  valid: {
    user_id: 1,
    has_permanent_reservation: true,
    permanent_reservation_weekday: 2,
    permanent_reservation_hour: 13,
    permanent_reservation_minute: 30,
    permanent_reservation_lesson_length: 60,
    permanent_reservation_lesson_count: 4,
  },
  validUpdate: {
    user_id: 1,
    has_permanent_reservation: true,
    permanent_reservation_weekday: 3,
    permanent_reservation_hour: 14,
    permanent_reservation_minute: 30,
    permanent_reservation_lesson_length: 60,
    permanent_reservation_lesson_count: 4,
  },

  invalidIdList: ["string", undefined, null, 0, NaN, true, false],
  invalidDiscountList: ["string", null, NaN, true, false, 0.4],
  invalidHourList: ["string", null, NaN, true, false],
  invalidWeekdayList: ["string", null, NaN, true, false],
  invalidLengthList: ["string", undefined, null, NaN, true, false],
  invalidCountList: ["string", undefined, null, NaN, true, false],
  invalidHasPermanentReservationList: ["string", null, NaN],
};

module.exports = { planInfoData, updatePlanInfoData };
