const cron = require("node-cron");
const syncAutomaticLessonReservations = require("../controllers/lessonReservations/syncAutomaticLessonReservations");
const logger = require("../utilities/logger");

const dailyTask = cron.schedule("* * * * *", async () => {
  console.log("running a task every minute");
  await syncAutomaticLessonReservations();
  logger.log("Automatic appointments have been generated");
});

// setInterval(async () => {
//   await syncAutomaticLessonReservations();
//   console.log("Automatic appointments have been generated");
// }, 15000);

module.exports = dailyTask;
