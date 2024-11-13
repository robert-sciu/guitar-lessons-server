const express = require("express");
const router = express.Router();
const planInfoController = require("../controllers/planInfo");
const {
  // validateGetPlanInfo,
  validateUpdatePlanInfo,
} = require("../validators/planInfoValidators");
const {
  verifyUserIsAdmin,
  authenticateJWT,
} = require("../utilities/authenticationMiddleware");
const { attachIdParam } = require("../utilities/middleware");

router.route("/").get(authenticateJWT, planInfoController.getPlanInfo);

router
  .route("/:id")
  .patch(
    authenticateJWT,
    verifyUserIsAdmin,
    attachIdParam,
    planInfoController.updatePlanInfo
  );

module.exports = router;
