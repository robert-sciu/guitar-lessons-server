const { body, query, param, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");

// const validateGetUserTasks = [
//   query("user_id")
//     .custom(customNotEmpty())
//     .isInt({ min: 1 })
//     .withMessage("Valid id is required"),

//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return handleErrorResponse(
//         res,
//         400,
//         formatValidationErrors(errors.array())
//       );
//     }
//     next();
//   },
// ];

const validateCreateUserTask = [
  body("task_id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Task id is required"),

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

const validateUpdateUserTask = [
  body("user_id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("User id is required"),
  body("task_id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Task id is required"),
  body("is_completed")
    .custom(customNotEmpty())
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
    next();
  },
];

const validateUpdateUserTaskNotes = [
  body("task_id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Task id is required"),
  body("user_notes").optional().isString().withMessage("Invalid user notes"),

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

const validateDeleteUserTask = [
  param("id")
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
  // validateGetUserTasks,
  validateCreateUserTask,
  validateUpdateUserTaskNotes,
  validateDeleteUserTask,
  validateUpdateUserTask,
};
