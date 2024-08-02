const express = require("express");
const router = express.Router();
const planInfoController = require("../controllers/planInfo");
const {
  validateGetPlanInfo,
  validateUpdatePlanInfo,
} = require("../validators/planInfoValidators");

router
  .route("/")
  .get(validateGetPlanInfo, planInfoController.getPlanInfo)
  .patch(validateUpdatePlanInfo, planInfoController.updatePlanInfo);

module.exports = router;
