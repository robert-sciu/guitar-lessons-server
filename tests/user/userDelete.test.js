require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createUserData, deleteUserData } = require("./data");
const { deleteTestDbEntry, createTestUser } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("DELETE /users", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.User, "users");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("DELETE /no user", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    const res = await request(app).delete(`${apiBaseUrl}/users`).query({
      id: 9999,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  test("DELETE /with invalid id", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    for (const invalid of deleteUserData.invalidIdList) {
      const res = await request(app).delete(`${apiBaseUrl}/users`).query({
        id: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("DELETE /user", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    const res = await request(app).delete(`${apiBaseUrl}/users`).query({
      id: 1,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User deleted successfully");
  });
});
