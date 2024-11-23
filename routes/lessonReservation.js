const express = require("express");
const router = express.Router();
const lessonReservationController = require("../controllers/lessonReservations");
const { authenticateJWT } = require("../utilities/authenticationMiddleware");
const { attachIdParam } = require("../utilities/middleware");
const {
  validateCreateLessonReservation,
} = require("../validators/lessonReservationsValidators");

router
  .route("/")
  .get(authenticateJWT, lessonReservationController.getLessonReservations)
  .post(
    authenticateJWT,
    validateCreateLessonReservation,
    lessonReservationController.createLessonReservation
  );

router
  .route("/:id")
  .patch(
    authenticateJWT,
    attachIdParam,
    lessonReservationController.updateLessonReservation
  )
  .delete(
    authenticateJWT,
    attachIdParam,
    lessonReservationController.deleteLessonReservation
  );

module.exports = router;
