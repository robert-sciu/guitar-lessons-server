require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createTagData } = require("./data");

const apiBaseUrl = process.env.API_BASE_URL;

describe("Tag Post Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    if (await sequelize.models.Tag.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/tags`).query({ id: 1 });
    }
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /tags with valid data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/tags`)
      .send(createTagData.valid);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Tag created successfully");
  });

  test("POST /tags with invalid category data", async () => {
    for (const invalid of createTagData.invalidCategoryList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/tags`)
        .send({
          ...createTagData.valid,
          category: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /tags with invalid value", async () => {
    for (const invalid of createTagData.invalidValueList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/tags`)
        .send({ ...createTagData.valid, value: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
