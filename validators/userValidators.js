const { body, query, validationResult, param } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
  detectUnnecessaryData,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
// const { CompressionType } = require("@aws-sdk/client-s3");
// const { Console } = require("winston/lib/winston/transports");
const allowList =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

console.log(allowList.registration.minUsernameLength);

const validateUsername = () => {
  return [
    body("username")
      .optional()
      .isString()
      .withMessage({
        pl: "Nazwa użytkownika musi być zawierać litery",
        en: "Username must be a string",
      })
      .isLength({
        min: allowList.registration.minUsernameLength,
        max: allowList.registration.maxUsernameLength,
      })
      .withMessage({
        pl: `Nazwa użytkownika musi mieć od ${allowList.registration.minUsernameLength} do ${allowList.registration.maxUsernameLength} znaków`,
        en: `Username must be between ${allowList.registration.minUsernameLength} and ${allowList.registration.maxUsernameLength} characters long`,
      })
      .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
      .withMessage({
        pl: "Nazwa użytkownika musi zawierać tylko litery i cyfry",
        en: "Username must contain only letters and numbers",
      }),
  ];
};

const validateEmail = () => {
  return [
    body("email").notEmpty().withMessage({
      pl: "Adres email jest wymagany",
      en: "Email is required",
    }),
    body("email").isEmail().withMessage({
      pl: "Niepoprawny adres email",
      en: "Invalid email",
    }),
  ];
};

const validatePassword = () => {
  return [
    body("password")
      .custom(customNotEmpty())
      .withMessage({
        pl: "Hasło jest wymagane",
        en: "Password is required",
      })
      .matches(/^[^\s\n\r]*$/)
      .withMessage({
        pl: "Hasło nie powinno zawierać spacji",
        en: "Password should not contain spaces",
      })
      .isLength({
        min: allowList.registration.minPasswordLength,
        max: allowList.registration.maxPasswordLength,
      })
      .withMessage({
        pl: `Hasło musi mieć przynajmniej od ${allowList.registration.minPasswordLength} do ${allowList.registration.maxPasswordLength} znaków`,
        en: `Password must be between ${allowList.registration.minPasswordLength} and ${allowList.registration.maxPasswordLength} characters long`,
      }),
  ];
};

const validateGetUser = [
  (req, res, next) => {
    if (detectUnnecessaryData(req)) {
      return handleErrorResponse(res, 400, {
        pl: "Niepotrzebne dane",
        en: "Unnecessary data",
      });
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
const validateCreateUser = [
  body("username").custom(customNotEmpty()).withMessage({
    pl: "Nazwa użytkownika jest wymagana",
    en: "Username is required",
  }),
  ...validateUsername(),
  ...validateEmail(),
  ...validatePassword(),

  (req, res, next) => {
    req.body = noValuesToUndefined(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array(), req.language)
      );
    }
    next();
  },
];

const validateUpdateUser = [
  // param("id").optional().isInt({ min: 1 }).withMessage({
  //   pl: "Niepoprawny identyfikator użytkownika",
  //   en: "Invalid user id",
  // }),

  // body("difficulty_clearance_level").optional().isInt({ min: 1 }).withMessage({
  //   pl: "Niepoprawny poziom trudności",
  //   en: "Invalid difficulty level",
  // }),
  // body("is_confirmed").optional().isBoolean().withMessage({
  //   pl: "Niepoprawna wartość",
  //   en: "Invalid value",
  // }),
  ...validateUsername(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array(), req.language)
      );
    }
    req.body = noValuesToUndefined(req.body);
    next();
  },
];

const validateChangeEmailRequest = [
  ...validateEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array(), req.language)
      );
    }
    next();
  },
];

const validateChangeEmail = [
  body("change_email_token")
    .custom(customNotEmpty())
    .withMessage({ pl: "Brak kodu", en: "No token" }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrorResponse(
        res,
        400,
        formatValidationErrors(errors.array(), req.language)
      );
    }
    next();
  },
];

const validateDeleteUser = [
  param("id").custom(customNotEmpty()).isInt({ min: 1 }).withMessage({
    pl: "Niepoprawny identyfikator użytkownika",
    en: "Invalid user id",
  }),

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

const validateResetPasswordRequest = [
  ...validateEmail(),

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

const validateResetPassword = [
  ...validateEmail(),
  ...validatePassword(),
  body("reset_password_token")
    .custom(customNotEmpty())
    .withMessage("Valid token is required"),

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
  validateGetUser,
  validateUpdateUser,
  validateChangeEmailRequest,
  validateChangeEmail,
  validateDeleteUser,
  validateResetPasswordRequest,
  validateResetPassword,
  validateCreateUser,
};
