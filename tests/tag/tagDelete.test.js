require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { createTagData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

describe("Tag Delete Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app).post(`${apiBaseUrl}/tags`).send(createTagData.valid);
  });
  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.Tag, "tags");
  });

  afterAll(async () => {
    sequelize.close();
  });

  test("DELETE /tags with valid query parameter", async () => {
    const res = await request(app)
      .delete(`${apiBaseUrl}/tags`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Tag deleted successfully");
  });

  test("DELETE /tags with invalid query parameter", async () => {
    for (const invalid of createTagData.invalidQueryList) {
      const res = await request(app)
        .delete(`${apiBaseUrl}/tags`)
        .query({ id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
