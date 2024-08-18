const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");

const validateCreateCalendarEntry = [
  body("weekday")
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage("Valid weekday is required"),
  body("date").optional().isISO8601().withMessage("Valid date is required"),
  body("availability_from")
    .custom(customNotEmpty())
    .isInt({ min: 0, max: 23 })
    .withMessage("Valid time is required"),
  body("availability_to")
    .custom(customNotEmpty())
    .isInt({ min: 0, max: 23 })
    .withMessage("Valid time is required"),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
    if (!req.body.weekday && !req.body.date) {
      return handleErrorResponse(res, 400, "date or weekday is required");
    }
    if (req.body.date && req.body.weekday) {
      return handleErrorResponse(
        res,
        400,
        "date and weekday cannot be used at the same time"
      );
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    }
    next();
  },
];

const validateUpdateCalendarEntry = [
  query("id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("weekday")
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage("Valid weekday is required"),
  body("date").optional().isISO8601().withMessage("Valid date is required"),
  body("availability_from")
    .optional()
    .isInt({ min: 0, max: 23 })
    .withMessage("valid time is required"),
  body("availability_to")
    .optional()
    .isInt({ min: 0, max: 23 })
    .withMessage("  valid time is required"),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
    if (req.body.date && req.body.weekday) {
      return handleErrorResponse(
        res,
        400,
        "date and weekday cannot be used at the same time"
      );
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    }
    next();
  },
];

const validateDeleteCalendarEntry = [
  query("id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    }
    next();
  },
];

const validateGetCalendarEntries = [
  query("id").optional().isInt({ min: 1 }).withMessage("Valid id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    }
    next();
  },
];

module.exports = {
  validateCreateCalendarEntry,
  validateUpdateCalendarEntry,
  validateDeleteCalendarEntry,
  validateGetCalendarEntries,
};
