const usersRouter = require("./users");
const tasksRouter = require("./tasks");

module.exports = (app) => {
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/tasks", tasksRouter);
};
