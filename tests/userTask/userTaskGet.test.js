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

describe("User Task Get Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    await createTestTask();

    await createTestUser();

    await request(app)
      .post(`${apiBaseUrl}/userTasks`)
      .send(createUserTaskData.valid);
  });
  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.UserTask, "userTasks");
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /userTasks with query parameter", async () => {
    const res = await request(app)
      .get(`${apiBaseUrl}/userTasks`)
      .query({ user_id: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual([
      {
        id: 1,
        user_id: createUserTaskData.valid.user_id,
        task_id: createUserTaskData.valid.task_id,
        user_notes: createUserTaskData.valid.user_notes,
        is_completed: false,
      },
    ]);
  });

  test("GET /userTasks with no query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/userTasks`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /userTasks with invalid query parameter", async () => {
    const res = await request(app)
      .get(`${apiBaseUrl}/userTasks`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /userTasks with valid query parameter and no user", async () => {
    const res = await request(app).get(`${apiBaseUrl}/userTasks`).query({
      user_id: 999,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});
