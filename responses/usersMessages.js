const { userNotFound } = require("./authenticationMessages");

const usersMessages = {
  mailInUse: {
    pl: "Ten email jest już zajęty",
    en: "Email already in use",
  },
  tokenRequired: {
    pl: "Wklej tutaj kod wysłany na twojego emaila",
    en: "Paste here the code sent to your email",
  },
  tokenSent: {
    pl: "Kod wysłany na twojego emaila",
    en: "Token sent to your email",
  },
  mailUpdated: {
    pl: "Email został zaktualizowany",
    en: "Email has been updated",
  },
  usersNotFound: {
    pl: "Nie znaleziono użytkowników",
    en: "Users not found",
  },
  userNotFound: {
    pl: "Użytkownik nie został znaleziony",
    en: "User not found",
  },
  userDeleted: {
    pl: "Użytkownik został usunięty",
    en: "User has been deleted",
  },
  userCreated: {
    pl: "Użytkownik został utworzony",
    en: "User has been created",
  },
  userActivated: {
    pl: "Użytkownik został aktywowany",
    en: "User has been activated",
  },
  userNotVerified: {
    pl: "Użytkownik nie został zwerifikowany",
    en: "User has not been verified",
  },
  verifyFirst: {
    pl: "Zanim się zalogujesz musisz zweryfikować swoje konto linkiem w wiadomości email",
    en: "Before logging in, you need to verify your account by clicking the link in the email",
  },
};

module.exports = usersMessages;
