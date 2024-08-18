const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
const allowList =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

const validateEmail = () => {
  return [
    body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  ];
};

const validatePassword = () => {
  return [
    body("password")
      .custom(customNotEmpty())
      .withMessage("Password is required")
      .matches(/[a-zA-Z]/)
      .withMessage("Password must contain at least one letter")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];
};

const validateCreateUser = [
  body("username")
    .custom(customNotEmpty())
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters long")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name must contain only letters, spaces, hyphens, or apostrophes"
    ),
  ...validateEmail(),
  ...validatePassword(),
  body("role")
    .custom(customNotEmpty())
    .isIn(allowList.user.roles)
    .withMessage('Role must be "admin" or "user"'),

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

const validateGetUser = [
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

const validateUpdateUser = [
  query("id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("difficulty_clearance_level")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid difficulty clearance level is required"),
  body("is_confirmed")
    .optional()
    .isBoolean()
    .withMessage("Valid boolean is required"),

  (req, res, next) => {
    if (!req.body.difficulty_clearance_level && !req.body.is_confirmed) {
      return handleErrorResponse(res, 400, "No update data provided");
    }
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

const validateDeleteUser = [
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

const validateResetPasswordRequest = [
  ...validateEmail(),

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

const validateResetPassword = [
  ...validateEmail(),
  ...validatePassword(),
  body("reset_password_token")
    .custom(customNotEmpty())
    .withMessage("Valid token is required"),

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
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser,
  validateResetPasswordRequest,
  validateResetPassword,
};
