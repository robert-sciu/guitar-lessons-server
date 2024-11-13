const {
  createRecord,
  destructureData,
  updateRecord,
  unchangedDataToUndefined,
  findAllRecords,
} = require("../utilities/controllerUtilites");

const { LessonReservation } = require("../models").sequelize.models;
const logger = require("../utilities/logger");
const { Op } = require("sequelize");
const { PlanInfo, User } = require("../models").sequelize.models;
// const {
//   checkForOverlapingHours,
// } = require("../utilities/planInfoControllerUtilities");
const moment = require("moment-timezone");

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieves all PlanInfo records that have a permanent reservation.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of
 * objects representing the PlanInfo records with permanent reservations.
 * Each object includes the associated user's username.
 */
async function findAllPlanInfosWithPermanentReservations() {
  return await PlanInfo.findAll({
    where: { has_permanent_reservation: true },
    include: [{ model: User, attributes: ["username"] }],
    raw: true,
    nest: true,
  });
}

/**
 * Retrieves all LessonReservation records for a given user that are permanent
 * reservations starting from today onwards.
 *
 * @param {number} user_id - the id of the user to retrieve permanent reservations for
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of LessonReservation objects
 */
async function getPermanentReservationsForUser(user_id) {
  const today = new Date().toISOString().split("T")[0];
  return await findAllRecords(LessonReservation, {
    user_id,
    start_UTC: {
      [Op.or]: [{ [Op.gt]: today }, { [Op.eq]: today }],
    },
    is_permanent: true,
  });
}

/**
 * Destructures a PlanInfo object to extract the necessary data to create
 * or update a LessonReservation.
 *
 * @param {Object} planInfo - the PlanInfo object to destructure
 * @returns {{ user_id: number, username: string, weekday: string, start_hour_UTC: string, end_hour_UTC: string, duration: number }}
 *
 */
function destructureReservationDataFromPlanInfo(planInfo) {
  const {
    user_id,
    permanent_reservation_weekday,
    permanent_reservation_start_hour_UTC,
    permanent_reservation_end_hour_UTC,
    permanent_reservation_lesson_duration,
    User: { username },
  } = destructureData(planInfo, [
    "user_id",
    "permanent_reservation_weekday",
    "permanent_reservation_start_hour_UTC",
    "permanent_reservation_end_hour_UTC",
    "permanent_reservation_lesson_duration",
    "User",
  ]);
  const planInfoReservationData = {
    user_id,
    username,
    weekday: permanent_reservation_weekday,
    start_hour_UTC: permanent_reservation_start_hour_UTC,
    end_hour_UTC: permanent_reservation_end_hour_UTC,
    duration: permanent_reservation_lesson_duration,
  };
  return planInfoReservationData;
}

function destructureReservationDataFromReservation(reservation) {
  const data = destructureData(reservation, [
    "user_id",
    "username",
    "start_UTC",
    "end_UTC",
    "duration",
    "rescheduled_by_teacher",
    "rescheduled_by_user",
  ]);
  return data;
}

function reservationDataToPlanInfoFormat(reservationData) {
  const start_date = new Date(reservationData.start_UTC).toISOString();
  const end_date = new Date(reservationData.end_UTC).toISOString();

  const start_hour_UTC = start_date.split("T")[1].split(".")[0];
  const end_hour_UTC = end_date.split("T")[1].split(".")[0];
  const weekday = dateToWeekday(start_date.split("T")[0]);

  const dataForComparison = {
    user_id: reservationData.user_id,
    username: reservationData.username,
    weekday,
    start_hour_UTC,
    end_hour_UTC,
    duration: reservationData.duration,
  };

  return dataForComparison;
}

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

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// HANDLERS //////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function
 * @description
 * Handles the case when two associated reservations are found.
 * Needed for the case when permanent reservation plan was changed and actual reservations
 * have to be updated. If there were no updates the handler returns almost immediately.
 *
 * @param {object[]} associatedReservations - array of associated reservations
 * @param {object} planInfoReservationData - data of the reservation from planInfo
 * @return {Promise<void>}
 */
async function handleTwoAssociatedReservations(
  associatedReservations,
  planInfoReservationData
) {
  try {
    await Promise.all(
      associatedReservations.map(async (associatedReservation) => {
        const associatedReservationData =
          destructureReservationDataFromReservation(associatedReservation);
        if (
          associatedReservationData.rescheduled_by_teacher ||
          associatedReservationData.rescheduled_by_user
        ) {
          return;
        }
        const dataForComparison = reservationDataToPlanInfoFormat(
          associatedReservationData
        );
        // check if the associated reservation is consistent with the plan info
        // if the planInfo was not changed we don't need to update the reservation
        if (
          !checkForChangedPermanentReservation(
            planInfoReservationData,
            dataForComparison
          )
        ) {
          return;
        }

        // TODO: after this point it may not work

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

/**
 * Handles the creation of lesson reservations when there are no existing associated reservations.
 * This function will create two reservations for the given plan information, one for the current week
 * and another for the next week, ensuring that permanent lesson reservations are maintained.
 * The typical scenario is that the permanent reservation plan was just enabled for the user.
 *
 * @param {Object} planInfoReservationData - The data extracted from PlanInfo required to create a reservation.
 * @param {number} planInfoReservationData.user_id - The ID of the user for whom the reservation is being created.
 * @param {string} planInfoReservationData.username - The username of the user.
 * @param {number} planInfoReservationData.weekday - The day of the week for the reservation.
 * @param {string} planInfoReservationData.start_hour_UTC - The start time of the reservation in UTC.
 * @param {string} planInfoReservationData.end_hour_UTC - The end time of the reservation in UTC.
 * @param {number} planInfoReservationData.duration - The duration of the reservation in minutes.
 *
 * Logs any errors encountered during the creation process.
 */
async function handleNoAssociatedReservations(planInfoReservationData) {
  const weekdayToDateOptions = [{ nextWeek: true }, { nextWeek: false }];
  await Promise.all(
    weekdayToDateOptions.map(async (isNextWeek) => {
      const date = weekdayToDate({
        weekday: planInfoReservationData.weekday,
        nextWeek: isNextWeek.nextWeek,
      });
      const start_UTC = `${date}T${planInfoReservationData.start_hour_UTC}.000Z`;
      const end_UTC = `${date}T${planInfoReservationData.end_hour_UTC}.000Z`;
      const reservationData = {
        user_id: planInfoReservationData.user_id,
        username: planInfoReservationData.username,
        start_UTC,
        end_UTC,
        duration: planInfoReservationData.duration,
        is_permanent: true,
      };
      try {
        await createRecord(LessonReservation, reservationData);
      } catch (error) {
        logger.error(error);
      }
    })
  );
}

module.exports = {
  findAllPlanInfosWithPermanentReservations,
  getPermanentReservationsForUser,
  destructureReservationDataFromPlanInfo,
  dateToWeekday,
  weekdayToDate,
  checkForChangedPermanentReservation,
  checkIfDateIsNextWeek,
  handleTwoAssociatedReservations,
  handleOneAssociatedReservation,
  checkReservationsConsistency,
  handleNoAssociatedReservations,
};
