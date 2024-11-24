const logger = require("../utilities/logger");
const {
  handleNoAssociatedReservations,
  handleOneAssociatedReservation,
  handleTwoAssociatedReservations,
  checkReservationsConsistency,

  destructureReservationDataFromPlanInfo,
  findAllPlanInfosWithPermanentReservations,
  getPermanentReservationsForUser,
  removeReservationsOlderThanMonth,
} = require("./reservationSyncHandlers");

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
    const planInfos = await findAllPlanInfosWithPermanentReservations();

    for (const planInfo of planInfos) {
      const user_id = planInfo.user_id;
      const planInfoReservationData =
        destructureReservationDataFromPlanInfo(planInfo);
      const associatedReservations = await getPermanentReservationsForUser(
        user_id
      );
      if (associatedReservations.length === 2) {
        await handleTwoAssociatedReservations(
          associatedReservations,
          planInfoReservationData
        );
      }
      // this is the case where there is one associated reservation
      // the most typical scenario is that the day of the lesson reservation has passed
      if (associatedReservations.length === 1) {
        await handleOneAssociatedReservation(
          associatedReservations,
          planInfoReservationData
        );
        // I imagine this as very rare scenario but in case the plan info was changed
        // while there's only one reservation in the database, the handleOneAssociatedReservation would not
        // update the existing reservation. So after the handleOneAssociatedReservation we'd
        // be left with two different reservations for each week. That's why we need to sync
        // the reservations again. This time we have two reservations so the handleTwoAssociatedReservations
        // will update both. As this should be very rare I do not worry about performance too much.

        if (!(await checkReservationsConsistency(user_id))) {
          await syncAutomaticLessonReservations();
        }
      }
      if (associatedReservations.length === 0) {
        await handleNoAssociatedReservations(planInfoReservationData);
      }
    }

    removeReservationsOlderThanMonth();
  } catch (error) {
    logger.error(error);
  }
}

module.exports = syncAutomaticLessonReservations;
