const { body, query, validationResult } = require("express-validator");

const validateCreateUser = [
  body("name").notEmpty().isString().withMessage("Valid name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
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
  body("user_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
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
    const { difficulty_clearance_level, is_confirmed } = req.body;
    if (!difficulty_clearance_level && !is_confirmed) {
      return res
        .status(400)
        .json({ success: false, message: "No update data provided" });
    }
    next();
  },
];

module.exports = { validateCreateUser, validateGetUser, validateUpdateUser };
