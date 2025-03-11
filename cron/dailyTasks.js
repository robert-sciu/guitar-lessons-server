const cron = require("node-cron");
const {
  removeReservationsOlderThanMonth,
} = require("../services/reservationSyncHandlers");

const dailyTask = cron.schedule("* * * * *", async () => {
  // console.log("running a task every minute");
  // await removeReservationsOlderThanMonth();
});

setInterval(async () => {
  await removeReservationsOlderThanMonth();
  console.log("Reservations older than a month have been removed");
}, 400000);

module.exports = dailyTask;
