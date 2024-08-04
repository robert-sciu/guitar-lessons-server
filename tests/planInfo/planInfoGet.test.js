require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { planInfoData } = require("./data");
const { createTestUser, deleteTestDbEntry } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("Plan Info Get Controller", () => {
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

  test("GET /planInfo", async () => {
    const userRes = await sequelize.models.User.findOne({ where: { id: 1 } });
    const user_id = userRes.dataValues.id;
    const res = await request(app)
      .get(`${apiBaseUrl}/planInfo`)
      .send({ user_id });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /planInfo with invalid query parameter", async () => {
    for (const invalid of planInfoData.invalidIdList) {
      const res = await request(app)
        .get(`${apiBaseUrl}/planInfo`)
        .send({ user_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("GET /planInfo with no query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/planInfo`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /planInfo with valid query parameter and no user", async () => {
    const res = await request(app).get(`${apiBaseUrl}/planInfo`).send({
      user_id: 999,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Plan info not found");
  });
});
