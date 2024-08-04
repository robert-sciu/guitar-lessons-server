require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createUserData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("User Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.User, "users");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /user using query parameter", async () => {
    await sequelize.models.User.create({
      ...createUserData.validStudent,
      ...createUserData.defaultValues,
    });

    const res = await request(app).get(`${apiBaseUrl}/users`).query({
      id: 1,
    });

    const { password, ...expectedStudent } = {
      ...createUserData.validStudent,
      ...createUserData.defaultValues,
      id: 1,
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body.userData).toStrictEqual(expectedStudent);
  });

  test("GET /user without query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/users`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test.each(createUserData.invalidQueryParameterList)(
    "GET /user with invalid query parameter",
    async (id) => {
      const res = await request(app).get(`${apiBaseUrl}/users`).query({ id });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
});
