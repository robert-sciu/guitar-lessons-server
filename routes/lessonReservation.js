const express = require("express");
const router = express.Router();
const lessonReservationController = require("../controllers/lessonReservations");
const { authenticateJWT } = require("../utilities/authenticationMiddleware");
const { attachIdParam } = require("../utilities/middleware");

router
  .route("/")
  .get(authenticateJWT, lessonReservationController.getLessonReservations)
  .post(authenticateJWT, lessonReservationController.createLessonReservation);

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
