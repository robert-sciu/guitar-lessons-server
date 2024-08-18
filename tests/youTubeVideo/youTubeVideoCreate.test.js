require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createYouTubeVideoData } = require("./data");

const { deleteTestDbEntry, createTestUser } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("POST /youTubeVideos", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.YouTubeVideo, "youTubeVideos");
  });
  afterAll(async () => {
    await sequelize.close();
  });
  test("POST /youTubeVideos with valid data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/youTubeVideos`)
      .send(createYouTubeVideoData.valid);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("YouTube video created successfully");
  });

  test("POST /youTubeVideos with no existing user", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/youTubeVideos`)
      .send({ ...createYouTubeVideoData.valid, user_id: 999 });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  test("POST /youTubeVideos with requred data only", async () => {
    const { category, position, user_id, ...requiredData } =
      createYouTubeVideoData.valid;

    const res = await request(app)
      .post(`${apiBaseUrl}/youTubeVideos`)
      .send(requiredData);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("YouTube video created successfully");
  });

  test("POST /youTubeVideos with no data", async () => {
    const res = await request(app).post(`${apiBaseUrl}/youTubeVideos`).send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /youTubeVideos with invalid title", async () => {
    for (const invalid of createYouTubeVideoData.invalid.titleList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/youTubeVideos`)
        .send({ ...createYouTubeVideoData.valid, title: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /youTubeVideos with invalid url", async () => {
    for (const invalid of createYouTubeVideoData.invalid.urlList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/youTubeVideos`)
        .send({ ...createYouTubeVideoData.valid, url: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /youTubeVideos with invalid category", async () => {
    for (const invalid of createYouTubeVideoData.invalid.categoryList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/youTubeVideos`)
        .send({ ...createYouTubeVideoData.valid, category: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /youTubeVideos with invalid position", async () => {
    for (const invalid of createYouTubeVideoData.invalid.positionList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/youTubeVideos`)
        .send({ ...createYouTubeVideoData.valid, position: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /youTubeVideos with invalid user_id", async () => {
    for (const invalid of createYouTubeVideoData.invalid.user_idList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/youTubeVideos`)
        .send({ ...createYouTubeVideoData.valid, user_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /youTubeVideos with invalid section", async () => {
    for (const invalid of createYouTubeVideoData.invalid.sectionList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/youTubeVideos`)
        .send({ ...createYouTubeVideoData.valid, section: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /youTubeVideos duplicate", async () => {
    await request(app)
      .post(`${apiBaseUrl}/youTubeVideos`)
      .send(createYouTubeVideoData.valid);
    const res = await request(app)
      .post(`${apiBaseUrl}/youTubeVideos`)
      .send(createYouTubeVideoData.valid);
    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("YouTube video already exists");
  });
});
