const { body, query, validationResult } = require("express-validator");
const { noValuesToUndefined } = require("../utilities/utilities");

const validateCreatePageText = [
  body("section").notEmpty().isString().withMessage("Section is required"),
  body("category").optional().isString().withMessage("Category is required"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position is required"),
  body("content_pl").notEmpty().isString().withMessage("Value is required"),
  body("content_en").notEmpty().isString().withMessage("Value is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    noValuesToUndefined(req.body);

    next();
  },
];

const validateDeletePageText = [
  query("id")
    .notEmpty()
    .withMessage("Valid id is required")
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

const validateUpdatePageText = [
  query("id")
    .notEmpty()
    .withMessage("Valid id is required")
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position is required"),
  body("content_pl").optional().isString().withMessage("Value is required"),
  body("content_en").optional().isString().withMessage("Value is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateCreatePageText,
  validateDeletePageText,
  validateUpdatePageText,
};
