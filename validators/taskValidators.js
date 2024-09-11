const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");

const validateGetTasks = [
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

const validateCreateTask = [
  body("title")
    .custom(customNotEmpty())
    .not()
    .isInt()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("artist").optional().isString().withMessage("Artist must be a string"),
  body("url").optional().isURL().withMessage("Valid URL is required"),
  body("filename")
    .optional()
    .isString()
    .withMessage("Filename must be a string"),
  body("notes_pl").optional().isString().withMessage("Notes must be a string"),
  body("notes_en").optional().isString().withMessage("Notes must be a string"),
  body("difficulty_level")
    .isInt({ min: 1 })
    .withMessage("Valid difficulty level is required"),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
    if (!req.body.url && !req.file) {
      return handleErrorResponse(res, 400, "File or URL is required");
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

const validateUpdateTask = [
  query("id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("title")
    .optional()
    .not()
    .isInt()
    .not()
    .isBoolean()
    .not()
    .isNumeric()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("artist").optional().isString().withMessage("Artist must be a string"),
  body("url").optional().isURL().withMessage("Valid URL is required"),
  body("notes_pl").optional().isString().withMessage("Notes must be a string"),
  body("notes_en").optional().isString().withMessage("Notes must be a string"),
  body("difficulty_level")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Valid difficulty level is required"),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
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

const validateDeleteTask = [
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
  validateGetTasks,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
};
