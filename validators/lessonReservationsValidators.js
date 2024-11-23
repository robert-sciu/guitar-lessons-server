const { body, validationResult } = require("express-validator");
const { formatValidationErrors } = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
const {
  customNotEmpty,
  validateIsISODateString,
} = require("../utilities/validatorsUtilities");

const validateCreateLessonReservation = [
  body("start_UTC").custom(customNotEmpty()).withMessage({
    pl: "Data rozpoczecia jest wymagana",
    en: "Start date is required",
  }),
  body("start_UTC")
    .custom(validateIsISODateString())
    .withMessage({ pl: "Niepoprawny format daty", en: "Invalid date" }),
  body("end_UTC").custom(customNotEmpty()).withMessage({
    pl: "Data zakonczenia jest wymagana",
    en: "End date is required",
  }),
  body("end_UTC")
    .custom(validateIsISODateString())
    .withMessage({ pl: "Niepoprawny format daty", en: "Invalid date" }),
  body("duration").custom(customNotEmpty()).isInt({ min: 30 }),

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
  validateCreateLessonReservation,
};
