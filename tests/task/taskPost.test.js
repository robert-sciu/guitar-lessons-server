require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createTaskData } = require("./data");
const path = require("path");

const filePath = path.join(__dirname, "files", "test.txt");

const apiBaseUrl = process.env.API_BASE_URL;

describe("POST task controller", () => {
  beforeAll(async () => {
    process.env.BUCKET_NAME = "test-guitar-lessons-bucket";
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    if (await sequelize.models.Task.findOne({ where: { id: 1 } })) {
      const res = await request(app)
        .delete(`${apiBaseUrl}/tasks`)
        .query({ id: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /tasks with valid full data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes", createTaskData.valid.notes)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Task created successfully");
  });

  test("POST /task with valid urls", async () => {
    for (const url of createTaskData.validUrlList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/tasks`)
        .send({
          title: createTaskData.validForUrlCheck.title + url,
          difficulty_level: createTaskData.validForUrlCheck.difficulty_level,
          url: url,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Task created successfully");
    }
  });

  test("POST /task with valid file only", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Task created successfully");
  });

  test("POST /task with existing file", async () => {
    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", filePath);

    const res = await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", filePath);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /task with invalid urls", async () => {
    for (const url of createTaskData.invalidUrlList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/tasks`)
        .send({
          title: createTaskData.validForUrlCheck.title + url,
          difficulty_level: createTaskData.validForUrlCheck.difficulty_level,
          url: url,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /task with no title", async () => {
    const res = await request(app).post(`${apiBaseUrl}/tasks`).send({
      artist: createTaskData.valid.artist,
      url: createTaskData.valid.url,
      notes: createTaskData.valid.notes,
      difficulty_level: createTaskData.valid.difficulty_level,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /task with existing title", async () => {
    await request(app).post(`${apiBaseUrl}/tasks`).send(createTaskData.valid);
    const res = await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .send(createTaskData.valid);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test.each(createTaskData.invalidTitleList)(
    "POST /task with invalid title",
    async (title) => {
      const res = await request(app).post(`${apiBaseUrl}/tasks`).send({
        title,
        artist: createTaskData.valid.artist,
        url: createTaskData.valid.url,
        notes: createTaskData.valid.notes,
        difficulty_level: createTaskData.valid.difficulty_level,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );

  test("POST /taks with no difficulty_level", async () => {
    const res = await request(app).post(`${apiBaseUrl}/tasks`).send({
      title: createTaskData.valid.title,
      artist: createTaskData.valid.artist,
      url: createTaskData.valid.url,
      notes: createTaskData.valid.notes,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
  test.each(createTaskData.invalidDifficultyLevelList)(
    "POST /task with invalid difficulty_level",
    async (difficulty_level) => {
      const res = await request(app).post(`${apiBaseUrl}/tasks`).send({
        title: createTaskData.valid.title,
        artist: createTaskData.valid.artist,
        url: createTaskData.valid.url,
        notes: createTaskData.valid.notes,
        difficulty_level,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
});
