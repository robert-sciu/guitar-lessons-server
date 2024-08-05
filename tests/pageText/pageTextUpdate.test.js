require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { pageTextData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("PATCH /pageText", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app).post(`${apiBaseUrl}/pageTexts`).send(pageTextData.valid);
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.PageText, "pageTexts");
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /pageTexts with valid query parameter", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageTexts`)
      .query({ id: 1 })
      .send(pageTextData.validUpdate);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Page text updated successfully");
  });

  test("PATCH /pageTexts that does not exist", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageTexts`)
      .query({ id: 999 })
      .send(pageTextData.validUpdate);
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Page text not found");
  });

  test("PATCH /pageTexts with no query parameter", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageTexts`)
      .send(pageTextData.validUpdate);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /pageTexts with no data", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageTexts`)
      .query({ id: 1 })
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /pageTexts with invalid category", async () => {
    for (const invalid of pageTextData.invalid.categoryList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageTexts`)
        .query({ id: 1 })
        .send({ ...pageTextData.validUpdate, category: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /pageTexts with invalid position", async () => {
    for (const invalid of pageTextData.invalid.positionList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageTexts`)
        .query({ id: 1 })
        .send({ ...pageTextData.validUpdate, position: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /pageTexts with invalid content", async () => {
    for (const invalid of pageTextData.invalid.contentList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageTexts`)
        .query({ id: 1 })
        .send({ ...pageTextData.validUpdate, content_pl: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
