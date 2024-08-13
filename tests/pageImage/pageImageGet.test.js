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

describe("GET /pageImages", () => {
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

  test("GET /pageImages", async () => {
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
    expect(url_desktop.length).toBeGreaterThan(0);
    expect(url_mobile.length).toBeGreaterThan(0);
    expect(url_lazy.length).toBeGreaterThan(0);
    expect(data).toEqual({
      id: 1,
      ...createPageImageData.valid,
      filename_desktop: expectedFilenamesForTestFile.desktop,
      filename_mobile: expectedFilenamesForTestFile.mobile,
      filename_lazy: expectedFilenamesForTestFile.lazy,
    });
  });

  test("GET /pageImages with no images", async () => {
    const res = await request(app).get(`${apiBaseUrl}/pageImages`).send();

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });
});
