const cron = require("node-cron");
const {
  createAutomaticLessonReservations,
} = require("../controllers/lessonReservations/createAutomaticLessonReservations");
const logger = require("../utilities/logger");

cron.schedule("0 0 * * *", async () => {
  await createAutomaticLessonReservations();
  logger.log("Automatic appointments have been generated");
});
