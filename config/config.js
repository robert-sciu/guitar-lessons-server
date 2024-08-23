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

module.exports = {
  development: {
    postgres: {
      options: {
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        // host: process.env.DB_HOST,
        dialect: "postgres",
      },
    },
    allowList: {
      pageImage: pageImage,
      pageText: pageText,
      tag: tag,
      user: user,
      youTubeVideo: youTubeVideo,
      lessonReservation: lessonReservation,
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
      lessonReservation: { minutes: [0, 15, 30, 45] },
    },
    config: {
      planInfo: planInfo,
    },
  },
};
