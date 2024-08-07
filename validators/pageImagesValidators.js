const { body, query, validationResult } = require("express-validator");
const { noValuesToUndefined } = require("../utilities/utilities");

const validateCreatePageImages = [
  body("title").notEmpty().isString().withMessage("Title is required"),
  body("section").notEmpty().isString().withMessage("Section is required"),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a number"),
  body("size_on_page").notEmpty().isString().withMessage("Value is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    } else {
      noValuesToUndefined(req);
      next();
    }
  },
];

module.exports = {
  validateCreatePageImages,
};
