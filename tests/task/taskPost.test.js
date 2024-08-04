require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createTaskData } = require("./data");
const path = require("path");
const { filterURL } = require("../../utilities/utilities");
const { deleteTestDbEntry } = require("../utilities/utilities");

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
    await deleteTestDbEntry(sequelize.models.Task, "tasks");
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
      .field("notes_pl", createTaskData.valid.notes_pl)
      .field("notes_en", createTaskData.valid.notes_en)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Task created successfully");

    const res2 = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({ difficulty_clearance_level: 10 });
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.data).toStrictEqual({
      ...createTaskData.valid,
      url: filterURL(createTaskData.valid.url),
      filename: "test.txt",
      id: 1,
    });
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
    expect(res.statusCode).toEqual(409);
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
    expect(res.statusCode).toEqual(409);
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

  test("POST /task with no url or file", async () => {
    const res = await request(app).post(`${apiBaseUrl}/tasks`).send({
      title: createTaskData.valid.title,
      artist: createTaskData.valid.artist,
      notes: createTaskData.valid.notes,
      difficulty_level: createTaskData.valid.difficulty_level,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
