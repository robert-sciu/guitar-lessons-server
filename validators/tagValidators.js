const { body, query, validationResult } = require("express-validator");
const { logger } = require("../utilities/mailer");
const { noValuesToUndefined } = require("../utilities/utilities");

const validateGetTags = [
  query("id").optional().isInt({ min: 1 }).withMessage("Valid id is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateCreateTag = [
  body("category").notEmpty().isString().withMessage("Category is required"),
  body("value").notEmpty().isString().withMessage("Value is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateUpdateTag = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("value").optional().isString().withMessage("Value must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({ success: false, message: errors.array() });
    }

    noValuesToUndefined(req.body);

    next();
  },
];

const validateDeleteTag = [
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
  validateGetTags,
  validateCreateTag,
  validateUpdateTag,
  validateDeleteTag,
};
