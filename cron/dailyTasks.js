const cron = require("node-cron");
const syncAutomaticLessonReservations = require("../services/reservationSyncService");
const logger = require("../utilities/logger");
const {
  removeReservationsOlderThanMonth,
} = require("../services/reservationSyncHandlers");

const dailyTask = cron.schedule("* * * * *", async () => {
  // console.log("running a task every minute");
  // await syncAutomaticLessonReservations();
  // await removeReservationsOlderThanMonth();
  // logger.log("Automatic appointments have been generated");
});

setInterval(async () => {
  await syncAutomaticLessonReservations();
  await removeReservationsOlderThanMonth();
  console.log("Automatic appointments have been generated");
  console.log("Reservations older than a month have been removed");
}, 4000);

module.exports = dailyTask;
