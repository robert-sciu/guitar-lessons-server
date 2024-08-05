require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { pageTextData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("DELETE /pageTexts", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app).post(`${apiBaseUrl}/pageTexts`).send(pageTextData.valid);
  });
  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.PageText, "pageTexts");
  });
  afterAll(async () => {
    sequelize.close();
  });

  test("DELETE /pageTexts with valid query parameter", async () => {
    const res = await request(app)
      .delete(`${apiBaseUrl}/pageTexts`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Page text deleted successfully");
  });

  test("DELETE /pageTexts that does not exist", async () => {
    const res = await request(app).delete(`${apiBaseUrl}/pageTexts`).query({
      id: 999,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Page text not found");
  });

  test("DELETE /pageTexts with invalid query parameter", async () => {
    for (const invalid of pageTextData.invalid.queryParameterList) {
      const res = await request(app)
        .delete(`${apiBaseUrl}/pageTexts`)
        .query({ id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("DELETE /pageTexts with no query parameter", async () => {
    const res = await request(app).delete(`${apiBaseUrl}/pageTexts`).send();
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
