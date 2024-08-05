require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createTaskData } = require("./data");
const path = require("path");
const { deleteTestDbEntry } = require("../utilities/utilities");

const filePath = path.join(__dirname, "files", "test.txt");

const apiBaseUrl = process.env.API_BASE_URL;

describe("DELETE /tasks", () => {
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

  test("DELETE /tasks with valid query parameter", async () => {
    const res = await request(app)
      .delete(`${apiBaseUrl}/tasks`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("DELETE /tasks that does not exist", async () => {
    const res = await request(app)
      .delete(`${apiBaseUrl}/tasks`)
      .query({ id: 999 });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });

  test.each(createTaskData.invalidQueryParameterList)(
    "DELETE /tasks with invalid query parameter",
    async (id) => {
      const res = await request(app)
        .delete(`${apiBaseUrl}/tasks`)
        .query({ id });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
});
