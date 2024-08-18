require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createYouTubeVideoData } = require("./data");

const { deleteTestDbEntry, createTestUser } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("GET /youTubeVideos", () => {
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

  test("GET /youTubeVideos with valid query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/youTubeVideos`).query({
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual({
      id: 1,
      ...createYouTubeVideoData.valid,
    });
  });

  test("GET /youTubeVideos with not existing video", async () => {
    const res = await request(app).get(`${apiBaseUrl}/youTubeVideos`).query({
      id: 999,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("YouTube video not found");
  });

  test("GET /youTubeVideos with no query parameter", async () => {
    const res = await request(app).get(`${apiBaseUrl}/youTubeVideos`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toStrictEqual([
      {
        id: 1,
        ...createYouTubeVideoData.valid,
      },
    ]);
  });

  test("GET /youTubeVideos with invalid query parameter", async () => {
    for (const invalid of createYouTubeVideoData.invalid.queryParameterList) {
      if (invalid === undefined) continue;
      const res = await request(app).get(`${apiBaseUrl}/youTubeVideos`).query({
        id: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
