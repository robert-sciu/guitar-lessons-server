const {
  userRouterProtected,
  userRouterAdmin,
  userRouterOpen,
} = require("./users");
const {
  authRouterOpen,
  authRouterProtected,
  authRouterAdmin,
} = require("./authentication");
const { tagsRouterOpen, tagsRouterAdmin } = require("./tags");
const { planInfoRouterProtected, planInfoRouterAdmin } = require("./planInfo");
const { pricingRouterOpen } = require("./pricing");

const { tasksRouterProtected, tasksRouterAdmin } = require("./tasks");
const {
  userTasksRouterProtected,
  userTasksRouterAdmin,
} = require("./userTasks");

const userTasksRouter = require("./userTasks");
const taskTagsRouter = require("./taskTags");
const pageTextsRouter = require("./pageTexts");
const pageImagesRouter = require("./pageImages");
const youTubeVideosRouter = require("./youTubeVideos");
const calendarRouter = require("./calendar");
const lessonReservationRouter = require("./lessonReservation");
const dbResetRouter = require("./dbReset");

const { sanitize } = require("../middleware/sanitization");
const { detectLanguage } = require("../utilities/languageDetector");

// const express = require("express");
const {
  authenticateJWT,
  authenticateAdminJWT,
} = require("../middleware/authenticationMiddleware");

const apiBaseUrl = process.env.API_BASE_URL;

const openRoutes = (app) => {
  app.use(detectLanguage);
  app.use(`${apiBaseUrl}/open/auth`, sanitize, authRouterOpen());
  app.use(`${apiBaseUrl}/open/users`, sanitize, userRouterOpen());
  app.use(`${apiBaseUrl}/open/pricing`, sanitize, pricingRouterOpen());
};
//prettier-ignore
const protectedRoutes = (app) => {
  app.use(sanitize)
  app.use(authenticateJWT)
  app.use(detectLanguage)
  app.use(`${apiBaseUrl}/auth`, sanitize, authRouterProtected());
  app.use(`${apiBaseUrl}/users`, sanitize, userRouterProtected());
  app.use(`${apiBaseUrl}/planInfo`, sanitize, planInfoRouterProtected());
  app.use(`${apiBaseUrl}/tasks`, sanitize, tasksRouterProtected());
  app.use(`${apiBaseUrl}/userTasks`, sanitize, userTasksRouterProtected());
  app.use(`${apiBaseUrl}/tags`, sanitize, tagsRouterOpen());
  app.use(`${apiBaseUrl}/taskTags`, sanitize, taskTagsRouter);
  app.use(`${apiBaseUrl}/pageTexts`, sanitize, pageTextsRouter);
  app.use(`${apiBaseUrl}/pageImages`, sanitize, pageImagesRouter);
  app.use(`${apiBaseUrl}/youTubeVideos`, sanitize, youTubeVideosRouter);
  //prettier-ignore
  app.use(`${apiBaseUrl}/lessonReservations`, sanitize, lessonReservationRouter);
  app.use(`${apiBaseUrl}/calendar`, sanitize, calendarRouter);
  app.use(`${apiBaseUrl}/reset`, dbResetRouter);
  
}

const adminRoutes = (app) => {
  app.use(sanitize);
  app.use(authenticateAdminJWT);
  app.use(detectLanguage);
  app.use(`${apiBaseUrl}/admin/auth`, sanitize, authRouterAdmin());
  app.use(`${apiBaseUrl}/admin/users`, sanitize, userRouterAdmin());
  //prettier-ignore
  app.use(`${apiBaseUrl}/admin/planInfo`, sanitize, planInfoRouterAdmin());
  app.use(`${apiBaseUrl}/admin/tasks`, sanitize, tasksRouterAdmin());
  app.use(`${apiBaseUrl}/admin/userTasks`, sanitize, userTasksRouterAdmin());
  app.use(`${apiBaseUrl}/admin/tags`, sanitize, tagsRouterAdmin());
};

module.exports = (app) => {
  openRoutes(app);
  protectedRoutes(app);
  adminRoutes(app);
};
