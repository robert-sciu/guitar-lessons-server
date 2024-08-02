const { body, query, validationResult } = require("express-validator");
const { noValuesToUndefined } = require("../utilities/utilities");

const validateGetPlanInfo = [
  query("id").optional().isInt({ min: 1 }).withMessage("Valid id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    next();
  },
];

const validateUpdatePlanInfo = [
  body("user_id")
    .notEmpty()
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
  body("permanent_reservation_lesson_length").optional().isInt({ min: 0 }),
  body("permanent_reservation_lesson_count").optional().isInt({ min: 0 }),
  body("regular_discount").optional().isInt({ min: 0 }),
  body("permanent_discount").optional().isInt({ min: 0 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    noValuesToUndefined(req.body);
    next();
  },
];

module.exports = { validateGetPlanInfo, validateUpdatePlanInfo };
