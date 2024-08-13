require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { pageTextData } = require("./data");

const { deleteTestDbEntry } = require("../utilities/utilities");

describe("POST /pageTexts", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.PageText, "pageTexts");
  });

  afterAll(async () => {
    sequelize.close();
  });

  test("POST /pageTexts with valid data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageTexts`)
      .send(pageTextData.valid);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Page text created successfully");

    const res2 = await request(app).get(`${apiBaseUrl}/pageTexts`).send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.data).toEqual([{ id: 1, ...pageTextData.valid }]);
  });

  test("POST /pageTexts with no data", async () => {
    const res = await request(app).post(`${apiBaseUrl}/pageTexts`).send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageTexts with invalid section", async () => {
    for (const invalid of pageTextData.invalid.sectionList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageTexts`)
        .send({ ...pageTextData.valid, section: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageTexts without section", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageTexts`)
      .send({ ...pageTextData.valid, section: null });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageTexts with invalid category", async () => {
    for (const invalid of pageTextData.invalid.categoryList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageTexts`)
        .send({ ...pageTextData.valid, category: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageTexts without category", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageTexts`)
      .send({ ...pageTextData.valid, category: undefined });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  test("POST /pageTexts with invalid position", async () => {
    for (const invalid of pageTextData.invalid.positionList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageTexts`)
        .send({ ...pageTextData.valid, position: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageTexts without position", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageTexts`)
      .send({ ...pageTextData.valid, position: undefined });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  test("POST /pageTexts with invalid content", async () => {
    for (const invalid of pageTextData.invalid.contentList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageTexts`)
        .send({ ...pageTextData.valid, content_pl: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
