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

describe("PATCH /userTasks", () => {
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

  test("PATCH /userTasks with valid data", async () => {
    for (const valid of createUserTaskData.validIsCompletedList) {
      const res = await request(app).patch(`${apiBaseUrl}/userTasks`).send({
        user_id: 1,
        task_id: 1,
        is_completed: valid,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    }
  });

  test("PATCH /userTasks with invalid data", async () => {
    for (const invalid of createUserTaskData.invalidIsCompletedList) {
      const res = await request(app).patch(`${apiBaseUrl}/userTasks`).send({
        user_id: 1,
        task_id: 1,
        is_completed: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /userTasks to the same data", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/userTasks`).send({
      user_id: 1,
      task_id: 1,
      is_completed: true,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    const res2 = await request(app).patch(`${apiBaseUrl}/userTasks`).send({
      user_id: 1,
      task_id: 1,
      is_completed: "true",
    });
    expect(res2.statusCode).toEqual(409);
    expect(res2.body.success).toBe(false);
    expect(res2.body.message).toBe("Cannot update to same value");
  });

  test("PATCH /userTasks with no data", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/userTasks`).send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
