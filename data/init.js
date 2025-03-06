const userService = require("../controllers/users/userService");
const { Task, User, PlanInfo, Pricing } = require("../models");

const tasksData = [
  {
    artist: "iron maiden",
    title: "ulalala",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Scorpions",
    title: "Ma bebe",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Justin Bieber",
    title: "Taylor Swift",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Doda Elektroda",
    title: "U klocucha",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Lady Pank",
    title: "Sufler z budki",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Nirvana",
    title: "Life is great",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Behemoth",
    title: "Allelujah",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Vivaldi",
    title: "at the club",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Blink 1500",
    title: "black sorrows",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Taylor Swift",
    title: "Justin Bieber",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 1,
  },
  {
    artist: "Dream Theather",
    title: "Christmas time",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Slayer",
    title: "Whe two souls meet",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "alternate picking",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "alternate picking part 2",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "alternate picking part 3",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "alternate picking part 4",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "sweep picking part 1",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "sweep picking part 2",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "sweep picking part 3",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "sweep picking part 4",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
  {
    artist: "Sciu",
    title: "sweep picking part 5",
    url: "youtube.com",
    youtube_url: "youtube.com",
    notes_pl: "notatki",
    notes_en: "notes",
    difficulty_level: 3,
  },
];

const pricing = {
  regular_lesson_price_pl: 150,
  permanent_lesson_price_60_min_pl: 100,
  permanent_lesson_price_90_min_pl: 95,
  permanent_lesson_price_120_min_pl: 90,
  regular_lesson_price_en: 200,
  permanent_lesson_price_60_min_en: 150,
  permanent_lesson_price_90_min_en: 145,
  permanent_lesson_price_120_min_en: 140,
};

const usersData = [
  {
    username: "admin",
    email: "robert.sciu@gmail.com",
    password: "admin1234",
    role: "admin",
    difficulty_clearance_level: 999,
    minimum_task_level_to_display: 1,
    is_verified: true,
    is_active: true,
  },
  {
    username: "robert",
    email: "gitara.rs@gmail.com",
    password: "user1234",
    role: "user",
    difficulty_clearance_level: 10,
    minimum_task_level_to_display: 1,
    is_verified: true,
    is_active: true,
  },
  {
    username: "miżord",
    email: "sciubilecki.robert@gmail.com",
    password: "user1234",
    role: "user",
    difficulty_clearance_level: 4,
    minimum_task_level_to_display: 1,
    is_verified: false,
    is_active: false,
  },
  {
    username: "kwasar",
    email: "robert.sciu.data@gmail.com",
    password: "user1234",
    role: "user",
    difficulty_clearance_level: 3,
    minimum_task_level_to_display: 2,
    is_verified: true,
    is_active: true,
  },
  {
    username: "pikar",
    email: "robert.sciu.photos@gmail.com",
    password: "user1234",
    role: "user",
    difficulty_clearance_level: 3,
    minimum_task_level_to_display: 2,
    is_verified: true,
    is_active: true,
  },
];

const planInfoData = [
  {
    user_id: 1,
    lesson_language: "pl",
  },
  {
    user_id: 2,
    lesson_language: "pl",
  },
  {
    user_id: 3,
    lesson_language: "pl",
  },
  {
    user_id: 4,
    lesson_language: "pl",
  },
  {
    user_id: 5,
    lesson_language: "pl",
  },
];

async function insertSampleData() {
  try {
    for (const task of tasksData) {
      await Task.create(task);
    }

    for (const user of usersData) {
      user.password = await userService.hashPassword(user.password);
      await User.create(user);
    }

    for (const planInfo of planInfoData) {
      await PlanInfo.create(planInfo);
    }

    await Pricing.create(pricing);
  } catch (error) {
    console.log(error);
  }
}

module.exports = insertSampleData;
