const usersRouter = require("./users");
const tasksRouter = require("./tasks");
const userTasksRouter = require("./userTasks");
const tagsRouter = require("./tags");
const taskTagsRouter = require("./taskTags");
const planInfoRouter = require("./planInfo");
const pageTextsRouter = require("./pageTexts");
const pageImagesRouter = require("./pageImages");
const youTubeVideosRouter = require("./youTubeVideos");
const calendarRouter = require("./calendar");
const lessonReservationRouter = require("./lessonReservation");
const loginRouter = require("./login");

const { sanitize } = require("../utilities/sanitization");

const apiBaseUrl = process.env.API_BASE_URL;
//prettier-ignore
module.exports = (app) => {
  app.use(`${apiBaseUrl}/users`, sanitize, usersRouter);
  app.use(`${apiBaseUrl}/tasks`, sanitize, tasksRouter);
  app.use(`${apiBaseUrl}/userTasks`, sanitize, userTasksRouter);
  app.use(`${apiBaseUrl}/tags`, sanitize, tagsRouter);
  app.use(`${apiBaseUrl}/taskTags`, sanitize, taskTagsRouter);
  app.use(`${apiBaseUrl}/planInfo`, sanitize, planInfoRouter);
  app.use(`${apiBaseUrl}/pageTexts`, sanitize, pageTextsRouter);
  app.use(`${apiBaseUrl}/pageImages`, sanitize, pageImagesRouter);
  app.use(`${apiBaseUrl}/youTubeVideos`, sanitize, youTubeVideosRouter);
  app.use(`${apiBaseUrl}/calendar`, sanitize, calendarRouter);
  app.use(`${apiBaseUrl}/lessonReservations`, sanitize, lessonReservationRouter);
  app.use(`${apiBaseUrl}/login`, sanitize, loginRouter);
};
