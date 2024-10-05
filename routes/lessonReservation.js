const express = require("express");
const router = express.Router();
const lessonReservationController = require("../controllers/lessonReservations");
const { authenticateJWT } = require("../utilities/authenticationMiddleware");

router
  .route("/")
  .get(lessonReservationController.getLessonReservations)
  .post(authenticateJWT, lessonReservationController.createLessonReservation)
  .patch(authenticateJWT, lessonReservationController.updateLessonReservation);

router
  .route("/:id")
  .delete(authenticateJWT, lessonReservationController.deleteLessonReservation);

module.exports = router;
