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

describe("GET /tasks", () => {
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
      .attach("file", filePath);
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.Task, "tasks");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /tasks without query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/tasks`).send({
      difficulty_clearance_level: 10,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toStrictEqual([
      {
        id: 1,
        title: createTaskData.valid.title,
        artist: createTaskData.valid.artist,
        url: filterURL(createTaskData.valid.url),
        filename: "test.txt",
        notes_pl: createTaskData.valid.notes_pl,
        notes_en: createTaskData.valid.notes_en,
        difficulty_level: createTaskData.valid.difficulty_level,
      },
    ]);
  });

  test("GET /tasks with query parameter", async () => {
    const res = await request(app)
      .get(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .send({
        difficulty_clearance_level: 10,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toStrictEqual({
      id: 1,
      title: createTaskData.valid.title,
      artist: createTaskData.valid.artist,
      url: filterURL(createTaskData.valid.url),
      filename: "test.txt",
      notes_pl: createTaskData.valid.notes_pl,
      notes_en: createTaskData.valid.notes_en,
      difficulty_level: createTaskData.valid.difficulty_level,
    });
  });

  test.each(createTaskData.invalidQueryParameterList)(
    "GET /tasks with invalid query parameter",
    async (id) => {
      const res = await request(app)
        .get(`${apiBaseUrl}/tasks`)
        .query({ id: id })
        .send({
          difficulty_clearance_level: 10,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
});
