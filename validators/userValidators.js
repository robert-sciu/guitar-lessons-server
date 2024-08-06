const { body, query, validationResult } = require("express-validator");
const { noValuesToUndefined } = require("../utilities/utilities");

const validateEmail = () => {
  return [body("email").isEmail().withMessage("Valid email is required")];
};

const validatePassword = () => {
  return [
    body("password")
      .notEmpty()
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
    .notEmpty()
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
    .notEmpty()
    .isIn(["admin", "student"])
    .withMessage('Role must be "admin" or "student"'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateGetUser = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateUpdateUser = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),
  body("difficulty_clearance_level")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Valid difficulty clearance level is required"),
  body("is_confirmed")
    .optional()
    .isBoolean()
    .withMessage("Valid boolean is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    noValuesToUndefined(req);

    next();
  },
];

const validateDeleteUser = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateResetPasswordRequest = [
  body("email").isEmail().withMessage("Valid email is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateResetPassword = [
  ...validateEmail(),

  ...validatePassword(),

  body("reset_password_token")
    .notEmpty()
    .withMessage("Valid token is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
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
