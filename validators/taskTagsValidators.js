const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");

const validateGetTaskTags = [
  body("difficulty_clearance_level")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid difficulty clearance level is required"),

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

const validateCreateTaskTag = [
  body("task_id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Task id is required"),
  body("tag_id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Tag id is required"),

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

const validateDeleteTaskTag = [
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

module.exports = {
  validateGetTaskTags,
  validateCreateTaskTag,
  validateDeleteTaskTag,
};
