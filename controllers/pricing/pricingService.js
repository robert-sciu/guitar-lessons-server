const { findAllRecords } = require("../../utilities/controllerUtilites");

const { Pricing } = require("../../models").sequelize.models;

class PricingService {
  async getPricing() {
    return await findAllRecords(Pricing);
  }
}

const pricingService = new PricingService();

module.exports = pricingService;
