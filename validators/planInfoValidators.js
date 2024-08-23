const { body, query, validationResult } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
} = require("../utilities/validatorsUtilities");
const {
  handleErrorResponse,
  destructureData,
} = require("../utilities/controllerUtilites");
const allowLists =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

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
  body("permanent_reservation_hour")
    .optional()
    .isInt({ min: 0, max: 23 })
    .withMessage("must be a number between 0 and 23"),
  body("permanent_reservation_minute")
    .optional()
    .isInt({ min: 0, max: 59 })
    .withMessage("must be a number"),
  body("permanent_reservation_lesson_length")
    .optional()
    .isInt({ min: 60 })
    .withMessage("must be a number between 60 and 120"),
  body("permanent_reservation_lesson_count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("must be a number greater than or equal to 0"),
  body("special_discount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("must be a number greater than or equal to 0"),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
    const {
      has_permanent_reservation,
      permanent_reservation_weekday,
      permanent_reservation_hour,
      permanent_reservation_minute,
      permanent_reservation_lesson_length,
    } = destructureData(req.body, [
      "has_permanent_reservation",
      "permanent_reservation_weekday",
      "permanent_reservation_hour",
      "permanent_reservation_minute",
      "permanent_reservation_lesson_length",
    ]);
    const permanent_reservation_data = [
      has_permanent_reservation,
      permanent_reservation_weekday,
      permanent_reservation_hour,
      permanent_reservation_minute,
      permanent_reservation_lesson_length,
    ];
    if (permanent_reservation_data.some((data) => data !== undefined)) {
      if (has_permanent_reservation !== false) {
        if (
          !allowLists.lessonReservation.minutes.includes(
            permanent_reservation_minute
          )
        ) {
          return handleErrorResponse(
            res,
            400,
            "Invalid minute for permanent reservation"
          );
        }
        if (
          !allowLists.lessonReservation.lengths.includes(
            permanent_reservation_lesson_length
          )
        ) {
          return handleErrorResponse(
            res,
            400,
            "Invalid length for permanent reservation"
          );
        }
        if (permanent_reservation_data.some((data) => data === undefined)) {
          return handleErrorResponse(
            res,
            400,
            "When updating permanent reservation, all data is required"
          );
        }
      }
    }
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
