const {
  createRecord,
  destructureData,
  updateRecord,
  unchangedDataToUndefined,
  findAllRecords,
} = require("./controllerUtilites");

const { LessonReservation } = require("../models").sequelize.models;
const logger = require("../utilities/logger");
const { Op } = require("sequelize");

function dateToWeekday(date) {
  return new Date(date).getDay();
}

function weekdayToDate({ weekday, nextWeek = false }) {
  const todayWeekday = new Date().getDay();
  const diff = weekday - todayWeekday;
  if (diff < 0) {
    if (nextWeek) {
      return weekdayToDate({ weekday: weekday + 7 + 7 });
    }
    return weekdayToDate({ weekday: weekday + 7 });
  }
  const date = new Date();
  if (nextWeek) {
    date.setDate(date.getDate() + diff + 7);
    return date.toISOString().split("T")[0];
  }
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

function checkIfDateIsNextWeek(date) {
  const today = new Date().toISOString().split("T")[0];
  if ((new Date(date) - new Date(today)) / 24 / 60 / 60 / 1000 >= 7) {
    return true;
  } else {
    return false;
  }
}

async function handleTwoAssociatedReservations(
  associatedReservations,
  planInfoReservationData
) {
  try {
    await Promise.all(
      associatedReservations.map(async (associatedReservation) => {
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
        // check if the associated reservation is consistent with the plan info
        // if the planInfo was not changed we don't need to update the reservation
        if (
          !checkForChangedPermanentReservation(
            planInfoReservationData,
            associatedReservationData
          )
        ) {
          return;
        }
        // previous if statement breaks the loop if the data has not changed
        // now we need to update the reservation with the new data
        // but drop the data that has not changed
        const updateDataNoDuplicates = unchangedDataToUndefined(
          associatedReservationData,
          planInfoReservationData
        );
        // this will only do something if the permanent weekday was changed
        // in planInfo. As the idea is that we always have two db entries for
        // a permanent lesson reservation we need to update both of them
        // there are two cases: the date is the same or the date is the next week
        // if the date is the next week we need to update the next week entry
        // if the date is the same week we need to update the same week entry
        if (updateDataNoDuplicates.weekday !== undefined) {
          updateDataNoDuplicates.date = weekdayToDate({
            weekday: updateDataNoDuplicates.weekday,
            nextWeek: !checkIfDateIsNextWeek(date),
          });
        }
        await updateRecord(LessonReservation, updateDataNoDuplicates, id);
      })
    );
  } catch (error) {
    logger.error(error);
  }
}

async function handleOneAssociatedReservation(
  planInfoReservationData,
  associatedReservations,
  user_id,
  permanent_reservation_weekday
) {
  try {
    const { date } = destructureData(associatedReservations[0].dataValues, [
      "date",
    ]);
    await createRecord(LessonReservation, {
      ...planInfoReservationData,
      user_id,
      date: weekdayToDate({
        weekday: permanent_reservation_weekday,
        nextWeek: !checkIfDateIsNextWeek(date),
      }),
      is_permanent: true,
    });
  } catch (error) {
    logger.error(error);
  }
}

async function checkReservationsConsistency(user_id, today) {
  const reservationForCurrentUser = await findAllRecords(LessonReservation, {
    user_id,
    date: {
      [Op.or]: [{ [Op.gt]: today }, { [Op.eq]: today }],
    },
  });
  if (reservationForCurrentUser.length !== 2) {
    logger.error(
      "syncAutomaticLessonReservations: handleOneAssociatedReservation did not create two new reservations for user",
      user_id
    );
    return;
  }
  const {
    hour: hour1,
    minute: minute1,
    duration: duration1,
  } = destructureData(reservationForCurrentUser[0].dataValues, [
    "hour",
    "minute",
    "duration",
  ]);

  const {
    hour: hour2,
    minute: minute2,
    duration: duration2,
  } = destructureData(reservationForCurrentUser[1].dataValues, [
    "hour",
    "minute",
    "duration",
  ]);
  if (hour1 !== hour2 || minute1 !== minute2 || duration1 !== duration2) {
    return false;
  }
  return true;
}

async function handleNoAssociatedReservations(
  planInfoReservationData,
  user_id,
  permanent_reservation_weekday
) {
  const weekdayToDateOptions = [{ nextWeek: true }, { nextWeek: false }];
  await Promise.all(
    weekdayToDateOptions.map(async (isNextWeek) => {
      try {
        await createRecord(LessonReservation, {
          ...planInfoReservationData,
          user_id,
          date: weekdayToDate({
            weekday: permanent_reservation_weekday,
            nextWeek: isNextWeek.nextWeek,
          }),
          is_permanent: true,
        });
      } catch (error) {
        logger.error(error);
      }
    })
  );
}

module.exports = {
  dateToWeekday,
  weekdayToDate,
  checkForChangedPermanentReservation,
  checkIfDateIsNextWeek,
  handleTwoAssociatedReservations,
  handleOneAssociatedReservation,
  checkReservationsConsistency,
  handleNoAssociatedReservations,
};
