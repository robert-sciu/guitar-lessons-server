const planInfoController = require("../controllers/planInfo");
const {
  // validateGetPlanInfo,
  validateUpdatePlanInfo,
} = require("../validators/planInfoValidators");

const { attachIdParam } = require("../middleware/commonMiddleware");
const express = require("express");

const planInfoRouterProtected = () => {
  const router = express.Router();
  router.route("/").get(planInfoController.getPlanInfo);

  return router;
};

const planInfoRouterAdmin = () => {
  const router = express.Router();
  router.route("/").get(planInfoController.getAllPlanInfos);
  router.route("/:id").patch(attachIdParam, planInfoController.updatePlanInfo);

  return router;
};

module.exports = {
  planInfoRouterProtected,
  planInfoRouterAdmin,
};
