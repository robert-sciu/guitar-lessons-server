const {
  findAllRecords,
  handleErrorResponse,
  destructureData,
  createRecord,
  findRecordByPk,
  updateRecord,
  deleteRecord,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");

const { User, PlanInfo, LessonReservation } =
  require("../../models").sequelize.models;
const { Op } = require("sequelize");
const logger = require("../../utilities/logger");

function dateToWeekday(date) {
  return new Date(date).getDay();
}

function weekdayToDate(weekday) {
  const todayWeekday = new Date().getDay();
  const diff = weekday - todayWeekday;
  const date = new Date();
  date.setDate(date.getDate() + diff);
  return date.toISOString().split("T")[0];
}

function checkForChangedPermanentReservation(
  dataFromPlanInfo,
  dataFromCalendar
) {
  const inconsistent = Object.keys(dataFromPlanInfo).some(
    (key) => dataFromPlanInfo[key] !== dataFromCalendar[key]
  );
  return inconsistent;
}

async function syncAutomaticLessonReservations() {
  try {
    const planInfos = await findAllRecords(PlanInfo, {
      has_permanent_reservation: true,
    });
    planInfos.forEach(async (planInfo) => {
      const {
        user_id,
        permanent_reservation_weekday,
        permanent_reservation_hour,
        permanent_reservation_minute,
        permanent_reservation_lesson_length,
      } = destructureData(planInfo.dataValues, [
        "user_id",
        "permanent_reservation_weekday",
        "permanent_reservation_hour",
        "permanent_reservation_minute",
        "permanent_reservation_lesson_length",
      ]);
      const today = new Date();
      const associatedReservations = await findAllRecords(LessonReservation, {
        user_id: user_id,
        date: {
          [Op.or]: [{ [Op.gt]: today }, { [Op.eq]: today }],
        },
      });
      const planInfoReservationData = {
        weekday: permanent_reservation_weekday,
        hour: permanent_reservation_hour,
        minute: permanent_reservation_minute,
        duration: permanent_reservation_lesson_length,
      };

      if (associatedReservations.length !== 0) {
        associatedReservations.forEach(async (associatedReservation) => {
          const { id, date, hour, minute, duration } = destructureData(
            associatedReservation.dataValues,
            ["id", "date", "hour", "minute", "duration"]
          );
          const associatedReservationData = {
            weekday: dateToWeekday(date),
            hour,
            minute,
            duration,
          };
          const inconsistent = checkForChangedPermanentReservation(
            planInfoReservationData,
            associatedReservationData
          );
          TODO: `this logic converts all reservations into closest weekday and hour
          so I need logic to change 2 reservations from 2 different days/weeks to 
          two new reservations in the same day/week.
          Also take into account that during cron job after the day of the lesson
          there will only be one future lesson reservation and the next the there will be two
          this MUST be bulletproof`;
          if (inconsistent) {
            const updateDataNoDuplicates = unchangedDataToUndefined(
              associatedReservationData,
              planInfoReservationData
            );
            if (updateDataNoDuplicates.weekday) {
              updateDataNoDuplicates.date = weekdayToDate(
                updateDataNoDuplicates.weekday
              );
            }
            await updateRecord(LessonReservation, updateDataNoDuplicates, id);
          }
        });
      }
    });
  } catch (error) {
    logger.log(error);
  }
}

module.exports = syncAutomaticLessonReservations;
