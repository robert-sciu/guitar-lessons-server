const {
  findAllRecords,
  destructureData,
} = require("../../utilities/controllerUtilites");

const { PlanInfo, LessonReservation } =
  require("../../models").sequelize.models;
const { Op } = require("sequelize");
const logger = require("../../utilities/logger");
const {
  handleNoAssociatedReservations,
  handleOneAssociatedReservation,
  handleTwoAssociatedReservations,
  checkReservationsConsistency,
} = require("../../utilities/lessonReservationControllerUtilities");

/**
 * syncAutomaticLessonReservations
 *
 * This function will sync the permanent lesson reservations in the database.
 * It will loop through all the planInfos that have a permanent lesson reservation.
 * If there is no associated reservation it will create it.
 * If there is one associated reservation it will create the second one for next week
 * if the date of the associated reservation is in the past.
 * If there are two associated reservations it will check if the data in the planInfo
 * and the reservation has changed. If it has not changed it will do nothing.
 * If it has changed it will update the reservation with the new data.
 *
 * It will also create a new reservation if the day of the reservation has passed
 * so that there will always be two reservations in the database.
 *
 * If there is an error it will log it.
 */
async function syncAutomaticLessonReservations() {
  try {
    const planInfos = await findAllRecords(PlanInfo, {
      has_permanent_reservation: true,
    });
    for (const planInfo of planInfos) {
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
      const planInfoReservationData = {
        weekday: permanent_reservation_weekday,
        hour: permanent_reservation_hour,
        minute: permanent_reservation_minute,
        duration: permanent_reservation_lesson_length,
      };
      const today = new Date().toISOString().split("T")[0];
      const associatedReservations = await findAllRecords(LessonReservation, {
        user_id,
        date: {
          [Op.or]: [{ [Op.gt]: today }, { [Op.eq]: today }],
        },
      });
      // if there are two associated reservations we need to check if the data has changed
      // if the data has not changed we don't need to update the reservation
      if (associatedReservations.length === 2) {
        await handleTwoAssociatedReservations(
          associatedReservations,
          planInfoReservationData
        );
      }
      // this is the case where there is one associated reservation
      // the most typical scenario is that the day of the lesson reservation has passed
      // and we need to create a new one for after the next week so we always have two.
      // Reservations older than today are not in the loop anyway
      // but to be safe it's also going to create this week entry
      // in case this week's reservation is gone for some reason
      // I don't account for the scenario where there's reservation to be created
      // and for some reason the plan info has changed in the meantime
      // but this seems to be virtually impossible to happen and even if it does
      // it will be corrected in the next sync
      if (associatedReservations.length === 1) {
        await handleOneAssociatedReservation(
          planInfoReservationData,
          associatedReservations,
          user_id,
          permanent_reservation_weekday
        );
        // I imagine this as very rare scenario but in case the plan info was changed
        // while there's only one reservation in the database, the handleOneAssociatedReservation would not
        // update the existing reservation. So after the handleOneAssociatedReservation we'd
        // be left with two different reservations for each week. That's why we need to sync
        // the reservations again. This time we have two reservations so the handleTwoAssociatedReservations
        // will update both. As this should be very rare I do not worry about performance too much.
        if (!(await checkReservationsConsistency(user_id, today))) {
          await syncAutomaticLessonReservations();
        }
      }

      // this is the case where there are no associated reservations so we need to create them
      // the typical scenario is that the user had no permanent lesson reservations
      // and now they have. We need to create two entries for the next week and the same week.
      if (associatedReservations.length === 0) {
        await handleNoAssociatedReservations(
          planInfoReservationData,
          user_id,
          permanent_reservation_weekday
        );
      }
    }
  } catch (error) {
    logger.error(error);
  }
}

module.exports = syncAutomaticLessonReservations;
