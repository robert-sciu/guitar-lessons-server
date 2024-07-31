require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createUserTaskData } = require("./data");
const { createTaskData } = require("../task/data");
const { createUserData } = require("../user/data");

const apiBaseUrl = process.env.API_BASE_URL;

describe("User Task Create Controller", () => {
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
  });
  afterEach(async () => {
    if (await sequelize.models.UserTask.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/userTasks`).query({ id: 1 });
    }
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /userTasks with valid data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/userTasks`)
      .send(createUserTaskData.valid);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);

    const userTask = await request(app)
      .get(`${apiBaseUrl}/userTasks`)
      .query({ user_id: 1 });
    expect(userTask.statusCode).toEqual(200);
    expect(userTask.body.success).toBe(true);
    expect(userTask.body.userTasks).toStrictEqual([
      { ...createUserTaskData.valid, id: 1, is_completed: false },
    ]);
  });

  test("POST /userTasks with invalid user id", async () => {
    for (const invalid of createUserTaskData.invalid.userIdList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/userTasks`)
        .send({ ...createUserTaskData.valid, user_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /userTasks with invalid task id", async () => {
    for (const invalid of createUserTaskData.invalid.taskIdList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/userTasks`)
        .send({ ...createUserTaskData.valid, task_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
