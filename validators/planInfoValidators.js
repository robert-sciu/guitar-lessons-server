const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");

const validateGetPlanInfo = [
  query("user_id")
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

const validateUpdatePlanInfo = [
  query("user_id")
    .custom(customNotEmpty())
    .isInt({ min: 1 })
    .withMessage("Valid id is required"),
  body("has_permanent_reservation")
    .optional()
    .isBoolean()
    .withMessage("Valid boolean is required"),
  body("permanent_reservation_weekday")
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage("Valid weekday is required"),
  body("permanent_reservation_hour").optional().isInt({ min: 0, max: 23 }),
  body("permanent_reservation_lesson_length").optional().isInt({ min: 60 }),
  body("permanent_reservation_lesson_count").optional().isInt({ min: 0 }),
  body("regular_discount").optional().isInt({ min: 0 }),
  body("permanent_discount").optional().isInt({ min: 0 }),

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

module.exports = { validateGetPlanInfo, validateUpdatePlanInfo };
