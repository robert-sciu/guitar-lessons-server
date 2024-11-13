const { body, query, validationResult, param } = require("express-validator");
const {
  formatValidationErrors,
  noValuesToUndefined,
  customNotEmpty,
  detectUnnecessaryData,
} = require("../utilities/validatorsUtilities");
const { handleErrorResponse } = require("../utilities/controllerUtilites");
const allowList =
  require("../config/config")[process.env.NODE_ENV]["allowList"];

const validateUsername = () => {
  return [
    body("username")
      .optional()
      .isString()
      .withMessage({
        pl: "Nazwa użytkownika musi być zawierać litery",
        en: "Username must be a string",
      })
      .isLength({ min: 4, max: 30 })
      .withMessage({
        pl: "Nazwa użytkownika musi mieć od 4 do 30 znaków",
        en: "Username must be between 4 and 30 characters long",
      })
      .matches(/^[a-zA-Z-]+$/)
      .withMessage({
        pl: "Nazwa użytkownik musi zawierać tylko litery i myślniki",
        en: "Name must contain only letters and hyphens",
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
      .matches(/[a-zA-Z]/)
      .withMessage({
        pl: "Hasło musi zawierać litery",
        en: "Password must contain letters",
      })
      .isLength({ min: 8 })
      .withMessage({
        pl: "Hasło musi mieć przynajmniej 8 znaków",
        en: "Password must be at least 8 characters long",
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
  body("role")
    .custom(customNotEmpty())
    .isIn(allowList.user.roles)
    .withMessage({ pl: "Niepoprawna rola", en: "Invalid role" }),

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
  param("id").custom(customNotEmpty()).isInt({ min: 1 }).withMessage({
    pl: "Niepoprawny identyfikator użytkownika",
    en: "Invalid user id",
  }),

  body("difficulty_clearance_level").optional().isInt({ min: 1 }).withMessage({
    pl: "Niepoprawny poziom trudności",
    en: "Invalid difficulty level",
  }),
  body("is_confirmed").optional().isBoolean().withMessage({
    pl: "Niepoprawna wartość",
    en: "Invalid value",
  }),
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
