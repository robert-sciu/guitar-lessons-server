require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createUserTaskData } = require("./data");
const {
  createTestTask,
  createTestUser,
  deleteTestDbEntry,
} = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("POST /userTasks", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    await createTestTask();

    await createTestUser();
  });
  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.UserTask, "userTasks");
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
    expect(userTask.body.data).toStrictEqual([
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

  test("POST /userTasks duplicate", async () => {
    await request(app)
      .post(`${apiBaseUrl}/userTasks`)
      .send(createUserTaskData.valid);

    const res = await request(app)
      .post(`${apiBaseUrl}/userTasks`)
      .send(createUserTaskData.valid);
    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
  });
});
