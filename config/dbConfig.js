const { logger } = require("sequelize/lib/utils/logger");

module.exports = {
  development: {
    postgres: {
      options: {
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        // host: process.env.DB_HOST,
        dialect: "postgres",
        logging: (msg) => {
          if (msg.includes("ERROR")) {
            logger.error(msg);
          }
        },
      },
    },
  },
};
