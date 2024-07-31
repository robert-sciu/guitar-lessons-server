const { body, query, validationResult } = require("express-validator");
const { logger } = require("../utilities/mailer");

const validateGetTaskTags = [
  body("difficulty_clearance_level")
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("Valid difficulty clearance level is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateCreateTaskTag = [
  body("task_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Task id is required"),
  body("tag_id").notEmpty().isInt({ min: 1 }).withMessage("Tag id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateDeleteTaskTag = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateGetTaskTags,
  validateCreateTaskTag,
  validateDeleteTaskTag,
};
