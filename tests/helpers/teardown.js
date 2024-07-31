require("dotenv").config();
const { sequelize } = require("../../models");

module.exports = async () => {
  await sequelize.close();
};
