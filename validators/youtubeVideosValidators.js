const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
const allowList =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

const validateCreateYouTubeVideo = [
  body("title")
    .custom(customNotEmpty())
    .isString()
    .not()
    .isNumeric()
    .not()
    .isBoolean()
    .withMessage("Title is required"),
  body("section")
    .notEmpty()
    .isString()
    .isIn(allowList.youTubeVideo.sections)
    .withMessage("Valid section is required"),
  body("category")
    .optional()
    .isString()
    .isIn(allowList.youTubeVideo.categories)
    .withMessage("Valid category is required"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a number"),
  body("url")
    .custom(customNotEmpty())
    .isURL()
    .withMessage("Valid URL is required"),
  body("user_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),

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

const validateUpdateYouTubeVideo = [
  query("id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("title")
    .optional()
    .isString()
    .not()
    .isNumeric()
    .not()
    .isBoolean()
    .withMessage("Title is required"),
  body("section")
    .optional()
    .isString()
    .isIn(allowList.youTubeVideo.sections)
    .withMessage("Section is required"),
  body("category")
    .optional()
    .isString()
    .isIn(allowList.youTubeVideo.categories)
    .withMessage("Category must be a string"),
  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Position must be a number"),
  body("url").optional().isURL().withMessage("Valid URL is required"),
  body("user_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),

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

const validateGetYouTubeVideos = [
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

const validateDeleteYouTubeVideo = [
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
  validateGetYouTubeVideos,
  validateCreateYouTubeVideo,
  validateUpdateYouTubeVideo,
  validateDeleteYouTubeVideo,
};
