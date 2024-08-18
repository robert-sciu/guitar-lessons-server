const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendar");

const {
  validateGetCalendarEntries,
  validateCreateCalendarEntry,
  validateUpdateCalendarEntry,
  validateDeleteCalendarEntry,
} = require("../validators/calendarValidators");

router
  .route("/")
  .get(validateGetCalendarEntries, calendarController.getCalendarEntries)
  .post(validateCreateCalendarEntry, calendarController.createCalendarEntry)
  .patch(validateUpdateCalendarEntry, calendarController.updateCalendarEntry)
  .delete(validateDeleteCalendarEntry, calendarController.deleteCalendarEntry);

module.exports = router;
