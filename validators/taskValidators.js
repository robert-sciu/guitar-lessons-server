const { body, query, validationResult } = require("express-validator");
const { noValuesToUndefined } = require("../utilities/utilities");

const validateGetTasks = [
  query("id").optional().isInt({ min: 1 }).withMessage("Valid id is required"),
  body("difficulty_clearance_level")
    .isInt({ min: 0 })
    .withMessage("Valid level is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateCreateTask = [
  body("title")
    .notEmpty()
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
    .isInt({ min: 0 })
    .withMessage("Valid difficulty level is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    noValuesToUndefined(req.body);
    next();
  },
];

const validateUpdateTask = [
  query("id").notEmpty().isInt({ min: 1 }).withMessage("Valid id is required"),
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
  body("filename")
    .optional()
    .isString()
    .withMessage("Filename must be a string"),
  body("notes_pl").optional().isString().withMessage("Notes must be a string"),
  body("notes_en").optional().isString().withMessage("Notes must be a string"),
  body("difficulty_level")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Valid difficulty level is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    noValuesToUndefined(req.body);
    next();
  },
];

const validateDeleteTask = [
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
  validateGetTasks,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
};
