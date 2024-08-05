require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const path = require("path");

const { createTaskData, updateTaskData } = require("./data");
const { filterURL } = require("../../utilities/utilities");
const { deleteTestDbEntry } = require("../utilities/utilities");

const file1Path = path.join(__dirname, "files", "test.txt");
const file2Path = path.join(__dirname, "files", "test2.txt");
const bigFilePath = path.join(__dirname, "files", "bigImg.webp");

const originalTaskData = {
  id: 1,
  title: createTaskData.valid.title,
  artist: createTaskData.valid.artist,
  url: filterURL(createTaskData.valid.url),
  filename: "test.txt",
  notes_pl: createTaskData.valid.notes_pl,
  notes_en: createTaskData.valid.notes_en,
  difficulty_level: createTaskData.valid.difficulty_level,
};

const apiBaseUrl = process.env.API_BASE_URL;

describe("UPDATE /tasks", () => {
  beforeAll(async () => {
    process.env.BUCKET_NAME = "test-guitar-lessons-bucket";
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes_pl", createTaskData.valid.notes_pl)
      .field("notes_en", createTaskData.valid.notes_en)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", file1Path);
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.Task, "tasks");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /task with valid parameters", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("title", updateTaskData.valid.title)
      .field("artist", updateTaskData.valid.artist)
      .field("url", updateTaskData.valid.url)
      .field("notes_pl", updateTaskData.valid.notes_pl)
      .field("notes_en", updateTaskData.valid.notes_en)
      .field("difficulty_level", updateTaskData.valid.difficulty_level)
      .attach("file", file2Path);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      id: 1,
      title: updateTaskData.valid.title,
      artist: updateTaskData.valid.artist,
      url: filterURL(updateTaskData.valid.url),
      filename: "test2.txt",
      notes_pl: updateTaskData.valid.notes_pl,
      notes_en: updateTaskData.valid.notes_en,
      difficulty_level: updateTaskData.valid.difficulty_level,
    });
  });

  test("PATCH /task with big file", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .attach("file", bigFilePath);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /task title", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("title", updateTaskData.valid.title);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      title: updateTaskData.valid.title,
    });
  });

  test("PATCH /task artist", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("artist", updateTaskData.valid.artist);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      artist: updateTaskData.valid.artist,
    });
  });

  test("PATCH /task url", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("url", updateTaskData.valid.url);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      url: filterURL(updateTaskData.valid.url),
    });
  });

  test("PATCH /task notes_pl", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("notes_pl", updateTaskData.valid.notes_pl);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      notes_pl: updateTaskData.valid.notes_pl,
    });
  });

  test("PATCH /task notes_en", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("notes_en", updateTaskData.valid.notes_en);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      notes_en: updateTaskData.valid.notes_en,
    });
  });

  test("PATCH /task difficulty_level", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("difficulty_level", updateTaskData.valid.difficulty_level);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      difficulty_level: updateTaskData.valid.difficulty_level,
    });
  });

  test("PATCH /task with two parameters", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("artist", updateTaskData.valid.artist)
      .field("url", updateTaskData.valid.url);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      artist: updateTaskData.valid.artist,
      url: filterURL(updateTaskData.valid.url),
    });
  });

  test("PATCH /task with no parameters", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No update data provided");
  });

  test("PATCH /task with invalid task_id", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 999 })
      .field("title", updateTaskData.valid.title);
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Task not found");
  });

  test("PATCH /task with invalid query parameter", async () => {
    for (const id of updateTaskData.invalidQueryParameterList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id })
        .field("title", updateTaskData.valid.title);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /task with invalid title", async () => {
    for (const title of updateTaskData.invalidTitleList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id: 1 })
        .field("title", title);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /task with invalid difficulty_level", async () => {
    for (const difficulty_level of updateTaskData.invalidDifficultyLevelList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id: 1 })
        .field("difficulty_level", difficulty_level);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /task with invalid url", async () => {
    for (const url of updateTaskData.invalidUrlList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id: 1 })
        .field("url", url);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
  test("PATCH /task with valid file", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .attach("file", file2Path);

    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      ...originalTaskData,
      filename: "test2.txt",
    });
  });
});
