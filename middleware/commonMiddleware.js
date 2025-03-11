const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const {
  handleErrorResponse,
  findRecordByPk,
} = require("../utilities/controllerUtilites");
const jwt = require("jsonwebtoken");
const { User } = require("../models").sequelize.models;

function useCommonMiddleware(app) {
  app.set("view engine", "ejs");
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
}

function useSecureConnection(app) {
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.secure || req.get("X-Forwarded-Proto") === "https") {
        return next();
      } else {
        res.redirect("https://" + req.hostname + req.url);
      }
    });
  } else {
    app.use((req, res, next) => {
      next();
    });
  }
}

const allowedOrigins = [
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_ORIGIN
    : process.env.DEV_ORIGIN,
];

function useCors(app) {
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      optionsSuccessStatus: 200,
      credentials: true,
      methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-auth-token",
        "Origin",
      ],
    })
  );
}

function useHelmet(app) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'report-sample'", "'self'"],
          styleSrc: ["'report-sample'", "'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          connectSrc: ["https://www.magda-art.click"],
          fontSrc: ["'self'"],
          frameSrc: ["'self'"],
          imgSrc: [
            "'self'",
            "data:",
            "https://robert-sciu-magda-art-bucket.s3.eu-central-1.amazonaws.com",
          ],
          manifestSrc: ["'self'"],
          mediaSrc: ["'self'"],
          workerSrc: ["'none'"],
        },
      },
    })
  );
}

function useRateLimit(app) {
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
  });

  app.use(limiter);
}

function attachIdParam(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return handleErrorResponse(
      res,
      400,
      {
        pl: "Brak identyfikatora",
        en: "No id",
      }[req.language]
    );
  }
  req.id = id;
  next();
}

module.exports = {
  useCors,
  useHelmet,
  useCommonMiddleware,
  useSecureConnection,
  useRateLimit,
  attachIdParam,
};
