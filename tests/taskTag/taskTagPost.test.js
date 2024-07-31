require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { createTaskTagData } = require("./data");
const { createTagData } = require("../tag/data");
const { createTaskData } = require("../task/data");

describe("Task Tag Post Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app)
      .post(`${apiBaseUrl}/tasks`)
      .field("title", createTaskData.valid.title)
      .field("artist", createTaskData.valid.artist)
      .field("url", createTaskData.valid.url)
      .field("notes", createTaskData.valid.notes)
      .field("difficulty_level", createTaskData.valid.difficulty_level);

    await request(app).post(`${apiBaseUrl}/tags`).send(createTagData.valid);
  });
  afterEach(async () => {
    if (await sequelize.models.TaskTag.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/taskTags`).query({ id: 1 });
    }
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /taskTags with valid data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/taskTags`)
      .send(createTaskTagData.valid);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Task tag created successfully");
  });

  test("POST /taskTags with invalid task id", async () => {
    for (const invalid of createTaskTagData.invalidIdList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/taskTags`)
        .send({ ...createTaskTagData.valid, task_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /taskTags with invalid tag id", async () => {
    for (const invalid of createTaskTagData.invalidIdList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/taskTags`)
        .send({ ...createTaskTagData.valid, tag_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /taskTags with invalid task id and tag id", async () => {
    for (const invalid of createTaskTagData.invalidIdList) {
      const res = await request(app)
        .post(`${apiBaseUrl}/taskTags`)
        .send({ task_id: invalid, tag_id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /taskTags with no task_id", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/taskTags`)
      .send({ tag_id: createTaskTagData.valid.tag_id });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /taskTags with no tag_id", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/taskTags`)
      .send({ task_id: createTaskTagData.valid.task_id });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /taskTags with no task_id and tag_id", async () => {
    const res = await request(app).post(`${apiBaseUrl}/taskTags`).send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
