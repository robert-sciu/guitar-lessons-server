require("dotenv");
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createPageImageData, expectedFilenamesForTestFile } = require("./data");
const path = require("path");
const { deleteTestDbEntry } = require("../utilities/utilities");

const filePath = path.join(__dirname, "files", "test.webp");

const apiBaseUrl = process.env.API_BASE_URL;

describe("POST /pageImages", () => {
  beforeAll(async () => {
    process.env.BUCKET_NAME = "test-guitar-lessons-bucket";
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.PageImage, "pageImages");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("DELETE /pageImages with valid query", async () => {
    const res = await request(app).delete(`${apiBaseUrl}/pageImages`).query({
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Page image deleted successfully");

    const res2 = await request(app).get(`${apiBaseUrl}/pageImages`).send();
    expect(res2.statusCode).toEqual(404);
    expect(res2.body.success).toBe(false);
  });

  test("DELETE /pageImages with invalid query", async () => {
    for (const invalid of createPageImageData.invalid.queryParameterList) {
      const res = await request(app)
        .delete(`${apiBaseUrl}/pageImages`)
        .query({ invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("DELETE /pageImages with not found", async () => {
    const res = await request(app).delete(`${apiBaseUrl}/pageImages`).query({
      id: 999,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Page image not found");
  });

  test("DELETE /pageImages with no query parameter", async () => {
    const res = await request(app).delete(`${apiBaseUrl}/pageImages`).send();
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
