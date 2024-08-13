const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  customNotEmpty,
  noValuesToUndefined,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
const allowList =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

const validateCreatePageImage = [
  body("title")
    .custom(customNotEmpty())
    .isString()
    .not()
    .isBoolean()
    .not()
    .isInt()
    .not()
    .isNumeric()
    .withMessage("Title is required"),
  body("section")
    .custom(customNotEmpty())
    .isIn(allowList.pageImage.sections)
    .withMessage("Section is required"),
  body("category")
    .optional()
    .isString()
    .isIn(allowList.pageImage.categories)
    .withMessage("Category must be a string"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a number"),
  body("size_on_page")
    .custom(customNotEmpty())
    .isString()
    .isIn(allowList.pageImage.sizesOnPage)
    .withMessage("Value is required"),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
    if (!req.file) {
      return handleErrorResponse(res, 400, "Image is required");
    }
    if (!allowList.pageImage.fileTypes.includes(req.file.mimetype)) {
      return handleErrorResponse(
        res,
        400,
        "Invalid File Type. Allowed types: png, jpg, jpeg, webp"
      );
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    } else {
      next();
    }
  },
];

const validateUpdatePageImage = [
  query("id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("title")
    .optional()
    .isString()
    .not()
    .isBoolean()
    .not()
    .isInt()
    .withMessage("Title is required"),
  body("section")
    .optional()
    .isString()
    .isIn(allowList.pageImage.sections)
    .withMessage("Section is required"),
  body("category")
    .optional()
    .isString()
    .isIn(allowList.pageImage.categories)
    .withMessage("Category must be a string"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a number"),
  body("size_on_page")
    .optional()
    .isString()
    .isIn(allowList.pageImage.sizesOnPage)
    .withMessage("Size on page must be a string"),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
    if (req.body.size_on_page) {
      if (!req.file) {
        return handleErrorResponse(
          res,
          400,
          "Resizing existing image is not allowed"
        );
      }
    }
    if (req.file) {
      if (!allowList.pageImage.fileTypes.includes(req.file.mimetype)) {
        return handleErrorResponse(res, 400, "Invalid File Type");
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array())
      );
    } else {
      next();
    }
  },
];

const validateDeletePageImage = [
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
    } else {
      next();
    }
  },
];

module.exports = {
  validateCreatePageImage,
  validateUpdatePageImage,
  validateDeletePageImage,
};
