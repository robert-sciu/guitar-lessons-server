const express = require("express");
const router = express.Router();
const lessonReservationController = require("../controllers/lessonReservations");

router
  .route("/")
  .get(lessonReservationController.getLessonReservations)
  .delete(lessonReservationController.deleteLessonReservation);

module.exports = router;
