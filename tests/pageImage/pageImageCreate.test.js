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
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.PageImage, "pageImages");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /pageImages with valid full data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Page image created successfully");

    const res2 = await request(app).get(`${apiBaseUrl}/pageImages`).send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.success).toBe(true);
    const { url_desktop, url_mobile, url_lazy, ...data } = res2.body.data[0];
    expect(data).toEqual({
      id: 1,
      ...createPageImageData.valid,
      filename_desktop: expectedFilenamesForTestFile.desktop,
      filename_mobile: expectedFilenamesForTestFile.mobile,
      filename_lazy: expectedFilenamesForTestFile.lazy,
    });
  });

  test("POST /pageImages with valid partial data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Page image created successfully");

    const res2 = await request(app).get(`${apiBaseUrl}/pageImages`).send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.success).toBe(true);
    const { url_desktop, url_mobile, url_lazy, ...data } = res2.body.data[0];
    expect(url_desktop.length).toBeGreaterThan(0);
    expect(url_mobile.length).toBeGreaterThan(0);
    expect(url_lazy.length).toBeGreaterThan(0);
    expect(data).toEqual({
      id: 1,
      ...createPageImageData.valid,
      filename_desktop: expectedFilenamesForTestFile.desktop,
      filename_mobile: expectedFilenamesForTestFile.mobile,
      filename_lazy: expectedFilenamesForTestFile.lazy,
      category: null,
      position: null,
    });
  });

  test("POST /pageImages with missing title", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageImages with missing section", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageImages with missing size_on_page", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .attach("file", filePath);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageImages with missing file", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST/ pageImages with invalid title", async () => {
    for (const invalid of createPageImageData.invalid.titleList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageImages`)
        .field("title", invalid)
        .field("section", createPageImageData.valid.section)
        .field("category", createPageImageData.valid.category)
        .field("position", createPageImageData.valid.position)
        .field("size_on_page", createPageImageData.valid.size_on_page)
        .attach("file", filePath);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageImages with invalid section", async () => {
    for (const invalid of createPageImageData.invalid.sectionList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageImages`)
        .field("title", createPageImageData.valid.title)
        .field("section", invalid)
        .field("category", createPageImageData.valid.category)
        .field("position", createPageImageData.valid.position)
        .field("size_on_page", createPageImageData.valid.size_on_page)
        .attach("file", filePath);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageImages with invalid category", async () => {
    for (const invalid of createPageImageData.invalid.categoryList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageImages`)
        .field("title", createPageImageData.valid.title)
        .field("section", createPageImageData.valid.section)
        .field("category", invalid)
        .field("position", createPageImageData.valid.position)
        .field("size_on_page", createPageImageData.valid.size_on_page)
        .attach("file", filePath);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageImages with NaN category", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("category", "NaN")
      .field("section", createPageImageData.valid.section)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageImages with invalid position", async () => {
    for (const invalid of createPageImageData.invalid.positionList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageImages`)
        .field("title", createPageImageData.valid.title)
        .field("section", createPageImageData.valid.section)
        .field("category", createPageImageData.valid.category)
        .field("position", invalid)
        .field("size_on_page", createPageImageData.valid.size_on_page)
        .attach("file", filePath);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageImages with invalid size_on_page", async () => {
    for (const invalid of createPageImageData.invalid.size_on_pageList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/pageImages`)
        .field("title", createPageImageData.valid.title)
        .field("section", createPageImageData.valid.section)
        .field("category", createPageImageData.valid.category)
        .field("position", createPageImageData.valid.position)
        .field("size_on_page", invalid)
        .attach("file", filePath);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /pageImages with invalid file", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", invalidFilePath);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageImages with missing file", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageImages with no data", async () => {
    const res = await request(app).post(`${apiBaseUrl}/pageImages`).send();
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /pageImages with duplicate title", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);

    const res2 = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath2);
    expect(res2.statusCode).toEqual(409);
    expect(res2.body.success).toBe(false);
    expect(res2.body.message).toBe(
      `Page image record named ${createPageImageData.valid.title} already exists. Please choose a different name.`
    );
  });

  test("POST /pageImages with duplicate file", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", createPageImageData.valid.title)
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);

    const res2 = await request(app)
      .post(`${apiBaseUrl}/pageImages`)
      .field("title", "unique title")
      .field("section", createPageImageData.valid.section)
      .field("category", createPageImageData.valid.category)
      .field("position", createPageImageData.valid.position)
      .field("size_on_page", createPageImageData.valid.size_on_page)
      .attach("file", filePath);
    expect(res2.statusCode).toEqual(409);
    expect(res2.body.success).toBe(false);
    expect(res2.body.message).toBe("Image already exists");
  });
});
