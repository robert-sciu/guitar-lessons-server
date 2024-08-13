const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
const allowList =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

const validateGetTags = [
  query("id").optional().isInt({ min: 1 }).withMessage("Valid id is required"),
  
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

const validateCreateTag = [
  body("category")
    .custom(customNotEmpty())
    .isString()
    .isIn(allowList.tag.categories)
    .withMessage("Category is required"),
  body("value")
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

const validateUpdateTag = [
  query("id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("category")
    .optional()
    .isString()
    .isIn(allowList.tag.categories)
    .withMessage("Category must be a string"),
  body("value").optional().isString().withMessage("Value must be a string"),

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

const validateDeleteTag = [
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

module.exports = {
  validateGetTags,
  validateCreateTag,
  validateUpdateTag,
  validateDeleteTag,
};
