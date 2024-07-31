require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createUserTaskData } = require("./data");
const { createTaskData } = require("../task/data");
const { createUserData } = require("../user/data");

const apiBaseUrl = process.env.API_BASE_URL;

describe("User Task Delete Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes", createTaskData.valid.notes)
      .field("difficulty_level", createTaskData.valid.difficulty_level);

    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    await request(app)
      .post(`${apiBaseUrl}/userTasks`)
      .send(createUserTaskData.valid);
  });
  afterEach(async () => {
    if (await sequelize.models.UserTask.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/userTasks`).query({ id: 1 });
    }
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("DELETE /userTasks with valid query parameter", async () => {
    const res = await request(app)
      .delete(`${apiBaseUrl}/userTasks`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("DELETE /userTasks with invalid query parameter", async () => {
    for (const invalid of createUserTaskData.invalidQueryList) {
      const res = await request(app)
        .delete(`${apiBaseUrl}/userTasks`)
        .query({ id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
