const { sequelize } = require("../../models");

beforeEach(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("beforeEach: sequelize sync completed");
  } catch (error) {
    console.error("beforeEach: sequelize sync failed", error);
  }
});

// afterEach(async () => {
//   try {
//     await sequelize.close();
//     console.log("afterEach: sequelize close completed");
//   } catch (error) {
//     console.error("afterEach: sequelize close failed", error);
//   }
// });
