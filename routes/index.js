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
const authenticationRouter = require("./authentication");
const dbResetRouter = require("./dbReset");

const { sanitize } = require("../utilities/sanitization");
const { detectLanguage } = require("../utilities/languageDetector");

const express = require("express");
const router = express.Router();

const apiBaseUrl = process.env.API_BASE_URL;
//prettier-ignore
const userRoutes = (app) => {
  app.use(detectLanguage)
  app.use(`${apiBaseUrl}/users`, sanitize, usersRouter(router));
  app.use(`${apiBaseUrl}/tasks`, sanitize, tasksRouter);
  app.use(`${apiBaseUrl}/userTasks`, sanitize, userTasksRouter);
  app.use(`${apiBaseUrl}/tags`, sanitize, tagsRouter);
  app.use(`${apiBaseUrl}/taskTags`, sanitize, taskTagsRouter);
  app.use(`${apiBaseUrl}/planInfo`, sanitize, planInfoRouter);
  app.use(`${apiBaseUrl}/pageTexts`, sanitize, pageTextsRouter);
  app.use(`${apiBaseUrl}/pageImages`, sanitize, pageImagesRouter);
  app.use(`${apiBaseUrl}/youTubeVideos`, sanitize, youTubeVideosRouter);
  app.use(`${apiBaseUrl}/auth`, sanitize, authenticationRouter);
  //prettier-ignore
  app.use(`${apiBaseUrl}/lessonReservations`, sanitize, lessonReservationRouter);
  app.use(`${apiBaseUrl}/calendar`, sanitize, calendarRouter);
  app.use(`${apiBaseUrl}/reset`, dbResetRouter);
  
}

const adminRoutes = (app) => {};

const openRoutes = (app) => {};

module.exports = (app) => {
  userRoutes(app);
  adminRoutes(app);
  openRoutes(app);
};
