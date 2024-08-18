require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createYouTubeVideoData } = require("./data");

const { deleteTestDbEntry, createTestUser } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("PATCH /youTubeVideos", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
    await request(app)
      .post(`${apiBaseUrl}/youTubeVideos`)
      .send(createYouTubeVideoData.valid);
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.YouTubeVideo, "youTubeVideos");
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /youTubeVideos with valid data", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .query({ id: 1 })
      .send(createYouTubeVideoData.validUpdate);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("YouTube video updated successfully");
  });

  test("PATCH /youTubeVideos with not existing video", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .query({ id: 999 })
      .send(createYouTubeVideoData.validUpdate);
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("YouTube video not found");
  });

  test("PATCH /youTubeVideos with no query parameter", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .send(createYouTubeVideoData.validUpdate);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /youTubeVideos with invalid query parameter", async () => {
    for (const invalid of createYouTubeVideoData.invalid.queryParameterList) {
      if (invalid === undefined) continue;
      const res = await request(app)
        .patch(`${apiBaseUrl}/youTubeVideos`)
        .query({ id: invalid })
        .send(createYouTubeVideoData.validUpdate);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /youTubeVideos with no user found", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .query({ id: 1 })
      .send({ ...createYouTubeVideoData.validUpdate, user_id: 999 });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  test("PATCH /youTubeVideos with no data", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .query({ id: 1 })
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /youTubeVideos with invalid title", async () => {
    for (const invalid of createYouTubeVideoData.invalid.titleUpdateList) {
      if (invalid === undefined) continue;
      if (invalid === "") continue;
      if (invalid === null) continue;
      const res = await request(app)
        .patch(`${apiBaseUrl}/youTubeVideos`)
        .query({ id: 1 })
        .send({ ...createYouTubeVideoData.validUpdate, title: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /youTubeVideos with invalid section", async () => {
    for (const invalid of createYouTubeVideoData.invalid.sectionList) {
      if (invalid === undefined) continue;
      const res = await request(app)
        .patch(`${apiBaseUrl}/youTubeVideos`)
        .query({ id: 1 })
        .send({ ...createYouTubeVideoData.validUpdate, section: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /youTubeVideos with invalid position", async () => {
    for (const invalid of createYouTubeVideoData.invalid.positionList) {
      if (invalid === undefined) continue;
      const res = await request(app)
        .patch(`${apiBaseUrl}/youTubeVideos`)
        .query({ id: 1 })
        .send({ ...createYouTubeVideoData.validUpdate, position: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /youTubeVideos with invalid user_id", async () => {
    for (const invalid of createYouTubeVideoData.invalid.user_idList) {
      if (invalid === undefined) continue;
      const res = await request(app)
        .patch(`${apiBaseUrl}/youTubeVideos`)
        .query({ id: 1 })
        .send({ ...createYouTubeVideoData.validUpdate, user_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /youTubeVideos with invalid url", async () => {
    for (const invalid of createYouTubeVideoData.invalid.urlList) {
      if (invalid === undefined) continue;
      const res = await request(app)
        .patch(`${apiBaseUrl}/youTubeVideos`)
        .query({ id: 1 })
        .send({ ...createYouTubeVideoData.validUpdate, url: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /youTubeVideos with invalid category", async () => {
    for (const invalid of createYouTubeVideoData.invalid.categoryList) {
      if (invalid === undefined) continue;
      const res = await request(app)
        .patch(`${apiBaseUrl}/youTubeVideos`)
        .query({ id: 1 })
        .send({ ...createYouTubeVideoData.validUpdate, category: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /youTubeVideos with title only", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .query({ id: 1 })
      .send({ title: createYouTubeVideoData.validUpdate.title });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /youTubeVideos with url only", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .query({ id: 1 })
      .send({ url: createYouTubeVideoData.validUpdate.url });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  test("PATCH /youTubeVideos with category only", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/youTubeVideos`)
      .query({ id: 1 })
      .send({ category: createYouTubeVideoData.validUpdate.category });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });
});
