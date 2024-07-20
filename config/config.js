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
      },
    },
  },
  test: {
    postgres: {
      options: {
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME_TEST,
        password: process.env.DB_PASSWORD_TEST,
        database: process.env.DB_DATABASE_TEST,
        // host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
      },
    },
  },
};
