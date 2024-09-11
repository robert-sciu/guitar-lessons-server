const { body, query, validationResult, cookie } = require("express-validator");
const {
  formatValidationErrors,
  customNotEmpty,
  noValuesToUndefined,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");

const validateLogin = [
  body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  body("password")
    .custom(customNotEmpty())
    .isString()
    .withMessage("Valid password is required"),
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

const validateRefreshToken = [
  cookie("refreshToken")
    .notEmpty()
    .isString()
    .withMessage("Refresh token is required"),

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
  validateLogin,
  validateRefreshToken,
};
