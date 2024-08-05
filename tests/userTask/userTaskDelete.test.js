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

describe("DELETE /userTasks", () => {
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
