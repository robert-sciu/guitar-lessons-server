const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");

const validateGetUserTasks = [
  query("user_id")
    .notEmpty()
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

const validateCreateUserTask = [
  body("user_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("User id is required"),
  body("task_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Task id is required"),
  body("user_notes")
    .optional()
    .isString()
    .withMessage("User notes is required"),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    }
    req.body = noValuesToUndefined(req.body);
    next();
  },
];

const validateUpdateUserTask = [
  body("user_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("User id is required"),
  body("task_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Task id is required"),
  body("is_completed")
    .notEmpty()
    .isBoolean()
    .not()
    .isInt()
    .withMessage("valid boolean is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    }

    req.body = noValuesToUndefined(req.body);
    next();
  },
];

const validateUpdateUserTaskNotes = [
  body("user_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("User id is required"),
  body("task_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Task id is required"),
  body("user_notes").optional().isString().withMessage("Invalid user notes"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    }
    req.body = noValuesToUndefined(req.body);
    next();
  },
];

const validateDeleteUserTask = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),

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
  validateGetUserTasks,
  validateCreateUserTask,
  validateUpdateUserTaskNotes,
  validateDeleteUserTask,
  validateUpdateUserTask,
};
