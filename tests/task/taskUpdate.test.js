require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const path = require("path");

const { createTaskData, updateTaskData } = require("./data");
const { filterURL } = require("../../utilities/utilities");

const file1Path = path.join(__dirname, "files", "test.txt");
const file2Path = path.join(__dirname, "files", "test2.txt");
const bigFilePath = path.join(__dirname, "files", "bigImg.webp");

const originalTaskData = {
  id: 1,
  title: createTaskData.valid.title,
  artist: createTaskData.valid.artist,
  url: filterURL(createTaskData.valid.url),
  filename: "test.txt",
  notes: createTaskData.valid.notes,
  difficulty_level: createTaskData.valid.difficulty_level,
};

const apiBaseUrl = process.env.API_BASE_URL;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Task Update controller", () => {
  beforeAll(async () => {
    process.env.BUCKET_NAME = "test-guitar-lessons-bucket";
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes", createTaskData.valid.notes)
      .field("difficulty_level", createTaskData.valid.difficulty_level)
      .attach("file", file1Path);
  });

  afterEach(async () => {
    if (await sequelize.models.Task.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/tasks`).query({ id: 1 });
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /task with valid parameters", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("title", updateTaskData.valid.title)
      .field("artist", updateTaskData.valid.artist)
      .field("url", updateTaskData.valid.url)
      .field("notes", updateTaskData.valid.notes)
      .field("difficulty_level", updateTaskData.valid.difficulty_level)
      .attach("file", file2Path);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      id: 1,
      title: updateTaskData.valid.title,
      artist: updateTaskData.valid.artist,
      url: filterURL(updateTaskData.valid.url),
      filename: "test2.txt",
      notes: updateTaskData.valid.notes,
      difficulty_level: updateTaskData.valid.difficulty_level,
    });
  });

  test("PATCH /task title", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("title", updateTaskData.valid.title);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      ...originalTaskData,
      title: updateTaskData.valid.title,
    });
  });

  test("PATCH /task artist", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("artist", updateTaskData.valid.artist);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      ...originalTaskData,
      artist: updateTaskData.valid.artist,
    });
  });

  test("PATCH /task url", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("url", updateTaskData.valid.url);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      ...originalTaskData,
      url: filterURL(updateTaskData.valid.url),
    });
  });

  test("PATCH /task notes", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("notes", updateTaskData.valid.notes);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      ...originalTaskData,
      notes: updateTaskData.valid.notes,
    });
  });

  test("PATCH /task difficulty_level", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("difficulty_level", updateTaskData.valid.difficulty_level);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      ...originalTaskData,
      difficulty_level: updateTaskData.valid.difficulty_level,
    });
  });

  test("PATCH /task with two parameters", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .field("artist", updateTaskData.valid.artist)
      .field("url", updateTaskData.valid.url);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      ...originalTaskData,
      artist: updateTaskData.valid.artist,
      url: filterURL(updateTaskData.valid.url),
    });
  });

  test("PATCH /task with no parameters", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No update data provided");
  });

  test.each(updateTaskData.invalidQueryParameterList)(
    "PATCH /task with invalid query parameter",
    async (id) => {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id })
        .field("title", updateTaskData.valid.title);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );

  test.each(updateTaskData.invalidTitleList)(
    "PATCH /task with invalid title",
    async (title) => {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id: 1 })
        .field("title", title);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );

  test.each(updateTaskData.invalidDifficultyLevelList)(
    "PATCH /task with invalid difficulty_level",
    async (difficulty_level) => {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id: 1 })
        .field("difficulty_level", difficulty_level);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );

  test.each(updateTaskData.invalidUrlList)(
    "PATCH /task with invalid url",
    async (url) => {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tasks`)
        .query({ id: 1 })
        .field("url", url);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );

  test("PATCH /task with invalid task_id", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 999 })
      .field("title", updateTaskData.valid.title);
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Task not found");
  });

  test("PATCH /task with valid file", async () => {
    await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .attach("file", file2Path);

    const res = await request(app).get(`${apiBaseUrl}/tasks`).query({ id: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task).toStrictEqual({
      ...originalTaskData,
      filename: "test2.txt",
    });
  });

  test("PATCH /task with big file", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tasks`)
      .query({ id: 1 })
      .attach("file", bigFilePath);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  // test("Patch /non existing task", async () => {
  //   const res = await request(app)
  //     .patch(`${apiBaseUrl}/tasks`)
  //     .query({ id: 999 })
  //     .field("title", updateTaskData.valid.title);
  //   expect(res.statusCode).toEqual(404);
  //   expect(res.body.success).toBe(false);
  //   expect(res.body.message).toBe("Task not found");
  // });
});
