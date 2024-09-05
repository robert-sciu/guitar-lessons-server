const express = require("express");
const router = express.Router();
const lessonReservationController = require("../controllers/lessonReservations");

router
  .route("/")
  .get(lessonReservationController.getLessonReservations)
  .post(lessonReservationController.createLessonReservation)
  .delete(lessonReservationController.deleteLessonReservation);

module.exports = router;
