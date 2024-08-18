const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
const allowList =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

const validateCreatePageText = [
  body("section")
    .custom(customNotEmpty())
    .isString()
    .isIn(allowList.pageText.sections)
    .withMessage("Section is required"),
  body("category")
    .optional()
    .isString()
    .isIn(allowList.pageText.categories)
    .withMessage("Category must be a string"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a number"),
  body("content_pl")
    .custom(customNotEmpty())
    .isString()
    .withMessage("Value is required"),
  body("content_en")
    .custom(customNotEmpty())
    .isString()
    .withMessage("Value is required"),

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

const validateDeletePageText = [
  query("id")
    .custom(customNotEmpty())
    .withMessage("Valid id is required")
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

const validateUpdatePageText = [
  query("id")
    .custom(customNotEmpty())
    .withMessage("Valid id is required")
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a number"),
  body("category")
    .optional()
    .isString()
    .isIn(allowList.pageText.categories)
    .withMessage("Category must be a string"),
  body("content_pl")
    .custom(customNotEmpty())
    .isString()
    .withMessage("Value is required"),
  body("content_en")
    .custom(customNotEmpty())
    .isString()
    .withMessage("Value is required"),

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

module.exports = {
  validateCreatePageText,
  validateDeletePageText,
  validateUpdatePageText,
};
