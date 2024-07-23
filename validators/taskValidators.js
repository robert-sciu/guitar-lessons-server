const { body, query, validationResult } = require("express-validator");

const validateCreateTask = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("artist").optional().isString().withMessage("Artist must be a string"),
  body("url").optional().isString().withMessage("URL must be a string"),
  body("filename")
    .optional()
    .isString()
    .withMessage("Filename must be a string"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
  body("difficulty_level")
    .isInt({ min: 0 })
    .withMessage("Valid difficulty level is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateGetTasks = [
  query("id").optional().isInt({ min: 1 }).withMessage("Valid id is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateCreateTask,
  validateGetTasks,
};
