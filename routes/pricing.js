const express = require("express");
const pricingController = require("../controllers/pricing");

const pricingRouterOpen = () => {
  const router = express.Router();
  router.route("/").get(pricingController.getPricing);
  return router;
};

module.exports = { pricingRouterOpen };
