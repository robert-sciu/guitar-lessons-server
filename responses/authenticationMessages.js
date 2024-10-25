const { invalidToken } = require("./commonMessages");

const authenticationMessages = {
  userNotFound: {
    pl: "Użytkownik nie został znaleziony",
    en: "User not found",
  },
  wrongPasswordOrEmail: {
    pl: "Niepoprawne hasło lub email",
    en: "Wrong password or email",
  },
  noToken: {
    pl: "Brak tokenu",
    en: "No token",
  },
  invalidToken: {
    pl: "Token nieprawidłowy",
    en: "Invalid token",
  },
  tokenExpired: {
    pl: "Token wygasł",
    en: "Token expired",
  },
  logoutSuccessful: {
    pl: "Wylogowano pomyślnie",
    en: "Logout successful",
  },
};

module.exports = authenticationMessages;
