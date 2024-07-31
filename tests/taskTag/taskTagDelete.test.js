require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { createTaskTagData, deleteTaskTagData } = require("./data");
const { createTagData } = require("../tag/data");
const { createTaskData } = require("../task/data");

describe("Task Tag Delete Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes", createTaskData.valid.notes)
      .field("difficulty_level", createTaskData.valid.difficulty_level);
    await request(app).post(`${apiBaseUrl}/tags`).send(createTagData.valid);

    await request(app)
      .post(`${apiBaseUrl}/taskTags`)
      .send(createTaskTagData.valid);
  });
  afterEach(async () => {
    if (await sequelize.models.TaskTag.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/taskTags`).query({ id: 1 });
    }
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("DELETE /taskTags with valid query parameter", async () => {
    const res = await request(app)
      .delete(`${apiBaseUrl}/taskTags`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Task tag deleted successfully");
  });

  test("DELETE /taskTags with invalid task_id parameter", async () => {
    for (const invalid of deleteTaskTagData.invalidIdList) {
      const res = await request(app)
        .delete(`${apiBaseUrl}/taskTags`)
        .query({ id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("DELETE /taskTags with no query parameter", async () => {
    const res = await request(app).delete(`${apiBaseUrl}/taskTags`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("DELETE /taskTags with not found", async () => {
    const res = await request(app)
      .delete(`${apiBaseUrl}/taskTags`)
      .query({ id: 999 });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Task tag not found");
  });
});
