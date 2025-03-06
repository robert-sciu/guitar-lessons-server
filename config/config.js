const pageImage = {
  sections: ["hero", "about", "contact"],
  categories: ["main", "secondary", "tertiary"],
  sizesOnPage: ["large", "medium", "small"],
  fileTypes: ["image/png", "image/jpg", "image/jpeg", "image/webp"],
};

const pageText = {
  sections: ["hero", "about", "contact"],
  categories: ["main", "secondary", "tertiary"],
  sizesOnPage: ["large", "medium", "small"],
};

const tag = {
  categories: ["genre", "instrument", "type", "artist", "difficulty"],
};

const user = {
  roles: ["admin", "user"],
};

const youTubeVideo = {
  sections: ["hero", "about", "contact"],
  categories: ["main", "secondary", "tertiary"],
};

const lessonReservation = {
  minutes: [0, 15, 30, 45],
  lengths: [60, 90, 120],
};

const planInfo = {
  maxDiscountPercent: 20,
  permanentPlanDiscountPercent: 10,
};

const registration = {
  minPasswordLength: 8,
  maxPasswordLength: 30,
  minUsernameLength: 5,
  maxUsernameLength: 20,
};

const tokensExpiry = {
  inDays: {
    userVerificationToken: 1,
    userActivationToken: 3,
  },
};

module.exports = {
  development: {
    allowList: {
      pageImage: pageImage,
      pageText: pageText,
      tag: tag,
      user: user,
      youTubeVideo: youTubeVideo,
      lessonReservation: lessonReservation,
      registration: registration,
      tokensExpiry: tokensExpiry,
    },
    config: {
      planInfo: planInfo,
    },
  },
  test: {
    postgres: {
      options: {
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME_TEST,
        password: process.env.DB_PASSWORD_TEST,
        database: process.env.DB_DATABASE_TEST,
        // host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
      },
    },
    allowList: {
      pageImage: {
        sections: ["hero", "about"],
        categories: ["main", "secondary"],
        sizesOnPage: ["large", "medium", "small"],
        fileTypes: ["image/png", "image/jpg", "image/jpeg", "image/webp"],
      },
      pageText: {
        sections: ["hero", "about"],
        categories: ["main", "secondary"],
      },
      tag: {
        categories: ["genre", "instrument", "type", "artist"],
      },
      user: { roles: ["admin", "student"] },
      youTubeVideo: {
        sections: ["hero", "about"],
        categories: ["main", "secondary"],
      },
      lessonReservation: { minutes: [0, 15, 30, 45], lengths: [60, 90, 120] },
      registration: {
        minPasswordLength: 8,
        maxPasswordLength: 30,
        minUsernameLength: 5,
        maxUsernameLength: 20,
      },
      tokensExpiry,
    },
    config: {
      planInfo: planInfo,
    },
  },
};
