const { findAllRecords } = require("../../utilities/controllerUtilites");

const { Pricing } = require("../../models").sequelize.models;

class PricingService {
  async getPricing() {
    const data = await findAllRecords(Pricing);
    const dataFormatted = { en: {}, pl: {} };

    Object.entries(data[0].dataValues).map((item) => {
      if (item[0].includes("pl")) {
        dataFormatted.pl[item[0].replace("_pl", "")] = item[1];
      } else {
        dataFormatted.en[item[0].replace("_en", "")] = item[1];
      }
    });

    return dataFormatted;
  }
}

const pricingService = new PricingService();

module.exports = pricingService;
