require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { createTagData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

describe("GET /tags", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app).post(`${apiBaseUrl}/tags`).send(createTagData.valid);
  });
  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.Tag, "tags");
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /tags with valid query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/tags`).query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      id: 1,
      ...createTagData.valid,
    });
  });

  test("GET /tags without query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/tags`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual([
      {
        id: 1,
        ...createTagData.valid,
      },
    ]);
  });

  test("GET /tags with invalid query parameter", async () => {
    for (const invalid of createTagData.invalidGetQueryList) {
      const res = await request(app)
        .get(`${apiBaseUrl}/tags`)
        .query({ id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("GET /tags that does not exist", async () => {
    const res = await request(app).get(`${apiBaseUrl}/tags`).query({ id: 999 });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Tag not found");
  });
});
