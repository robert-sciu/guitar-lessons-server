const express = require("express");
const router = express.Router();
const planInfoController = require("../controllers/planInfo");
const {
  validateGetPlanInfo,
  validateUpdatePlanInfo,
} = require("../validators/planInfoValidators");
const {
  verifyUserIsAdmin,
  authenticateJWT,
} = require("../utilities/authenticationMiddleware");

router
  .route("/")
  .get(validateGetPlanInfo, planInfoController.getPlanInfo)
  .patch(
    validateUpdatePlanInfo,
    authenticateJWT,
    verifyUserIsAdmin,
    planInfoController.updatePlanInfo
  );

module.exports = router;
