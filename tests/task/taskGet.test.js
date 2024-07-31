require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createTaskData } = require("./data");
const path = require("path");
const { filterURL } = require("../../utilities/utilities");

const filePath = path.join(__dirname, "files", "test.txt");

const apiBaseUrl = process.env.API_BASE_URL;

describe("Get Task Controller", () => {
  beforeAll(async () => {
    process.env.BUCKET_NAME = "test-guitar-lessons-bucket";
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    if (await sequelize.models.Task.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/tasks`).query({ id: 1 });
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /tasks without query parameter", async () => {
    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes", createTaskData.valid.notes)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", filePath);

    const res = await request(app).get(`${apiBaseUrl}/tasks`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.tasks).toStrictEqual([
      {
        id: 1,
        title: createTaskData.valid.title,
        artist: createTaskData.valid.artist,
        url: filterURL(createTaskData.valid.url),
        filename: "test.txt",
        notes: createTaskData.valid.notes,
        difficulty_level: createTaskData.valid.difficulty_level,
      },
    ]);
  });

  test("GET /tasks with query parameter", async () => {
    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes", createTaskData.valid.notes)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", filePath);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.task).toStrictEqual({
      id: 1,
      title: createTaskData.valid.title,
      artist: createTaskData.valid.artist,
      url: filterURL(createTaskData.valid.url),
      filename: "test.txt",
      notes: createTaskData.valid.notes,
      difficulty_level: createTaskData.valid.difficulty_level,
    });
  });

  test.each(createTaskData.invalidQueryParameterList)(
    "GET /tasks with invalid query parameter",
    async (id) => {
      const res = await request(app)
        .get(`${apiBaseUrl}/tasks`)
        .query({ id: createTaskData.invalidQueryParameterList });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
});
