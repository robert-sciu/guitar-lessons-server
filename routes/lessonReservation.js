const express = require("express");
const router = express.Router();
const lessonReservationController = require("../controllers/lessonReservations");
const { authenticateJWT } = require("../utilities/authenticationMiddleware");

router
  .route("/")
  .get(lessonReservationController.getLessonReservations)
  .post(lessonReservationController.createLessonReservation)
  .patch(authenticateJWT, lessonReservationController.updateLessonReservation)
  .delete(lessonReservationController.deleteLessonReservation);

module.exports = router;
