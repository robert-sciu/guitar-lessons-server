const { body, query, validationResult } = require("express-validator");

const validateGetUserTasks = [
  query("user_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
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
      return res.status(400).json({ success: false, message: errors.array() });
    }
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
      return res.status(400).json({ success: false, message: errors.array() });
    }

    next();
  },
];

const validateDeleteUserTask = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateGetUserTasks,
  validateCreateUserTask,
  validateUpdateUserTaskNotes,
  validateDeleteUserTask,
};
