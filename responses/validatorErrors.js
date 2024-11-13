const validatorErrors = {
  invalidString: {
    pl: "Niepoprawne dane, spróbuj samych liter",
    en: "Invalid data, try only letters",
  },
  stringLength: {
    pl: "Niepoprawna długość, spróbuj od 4 do 20 znaków",
    en: "Invalid length, try from 4 to 20 characters",
  },
  invalidEmail: {
    pl: "Niepoprawny email",
    en: "Invalid email",
  },
  usernameIsRequired: {
    pl: "Nazwa użytkownika jest wymagana",
    en: "Username is required",
  },
  usernameMustBeBetween2And50CharactersLong: {
    pl: "Nazwa użytkownika musi mieć od 2 do 50 znaków",
    en: "Username must be between 2 and 50 characters long",
  },
  usernameAllowedCharacters: {
    pl: "Nazwa użytkownika musi zawierać tylko litery, spacje, mysł, lub apostrofy",
    en: "Name must contain only letters, spaces, hyphens, or apostrophes",
  },
  invalidRole: {
    pl: "Można tworzyć tylko administratora lub użytkownika",
    en: "Only admin or user can be created",
  },
  noPassword: {
    pl: "Brak hasła",
    en: "No password",
  },
  letterMissing: {
    pl: "Hasło musi zawierać co najmniej jedna litere",
    en: "Password must contain at least one letter",
  },
};

module.exports = validatorErrors;
