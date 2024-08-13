require("dotenv");
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { createPageImageData, expectedFilenamesForTestFile } = require("./data");
const path = require("path");
const { deleteTestDbEntry } = require("../utilities/utilities");

const filePath = path.join(__dirname, "files", "test.webp");
const filePath2 = path.join(__dirname, "files", "test2.webp");
const invalidFilePath = path.join(__dirname, "files", "test.txt");

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

  test("PATCH /pageImages with valid query", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({
        id: 1,
      })
      .field("title", createPageImageData.validUpdate.title)
      .field("section", createPageImageData.validUpdate.section)
      .field("category", createPageImageData.validUpdate.category)
      .field("position", createPageImageData.validUpdate.position)
      .field("size_on_page", createPageImageData.validUpdate.size_on_page)
      .attach("file", filePath2);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Page image updated successfully");
  });

  test("PATCH /pageImages with invalid query", async () => {
    for (const invalid of createPageImageData.invalid.queryParameterList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageImages`)
        .query({ invalid })
        .field("title", createPageImageData.validUpdate.title)
        .field("section", createPageImageData.validUpdate.section)
        .field("category", createPageImageData.validUpdate.category)
        .field("position", createPageImageData.validUpdate.position)
        .field("size_on_page", createPageImageData.validUpdate.size_on_page)
        .attach("file", filePath2);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /pageImages with missing query", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.validUpdate.title)
      .field("section", createPageImageData.validUpdate.section)
      .field("category", createPageImageData.validUpdate.category)
      .field("position", createPageImageData.validUpdate.position)
      .field("size_on_page", createPageImageData.validUpdate.size_on_page)
      .attach("file", filePath2);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /pageImages with no page image", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 999 });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /pageImages with no data", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .send();
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /pageImages with valid title", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .field("title", createPageImageData.validUpdate.title);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /pageImages with invalid title", async () => {
    for (const invalid of createPageImageData.invalid.titleList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageImages`)
        .query({ id: 1 })
        .field("title", invalid);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /pageImages with valid section", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .field("section", createPageImageData.validUpdate.section);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /pageImages with invalid section", async () => {
    for (const invalid of createPageImageData.invalid.sectionList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageImages`)
        .query({ id: 1 })
        .field("section", invalid);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /pageImages with valid category", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .field("category", createPageImageData.validUpdate.category);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /pageImages with invalid category", async () => {
    for (const invalid of createPageImageData.invalid.categoryList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageImages`)
        .query({ id: 1 })
        .field("category", invalid);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /pageImages with valid position", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .field("position", createPageImageData.validUpdate.position);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /pageImages with invalid position", async () => {
    for (const invalid of createPageImageData.invalid.positionList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/pageImages`)
        .query({ id: 1 })
        .field("position", invalid);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /pageImages with valid size_on_page but no file", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .field("size_on_page", createPageImageData.validUpdate.size_on_page);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /pageImages with valid size_on_page and valid file", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .field("size_on_page", createPageImageData.validUpdate.size_on_page)
      .attach("file", filePath2);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /pageImages with valid file", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .attach("file", filePath2);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /pageImages with invalid file", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/pageImages`)
      .query({ id: 1 })
      .attach("file", invalidFilePath);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
