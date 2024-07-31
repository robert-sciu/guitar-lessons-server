require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { createTaskTagData, getTaskTagData } = require("./data");
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

    await request(app)
      .post(`${apiBaseUrl}/taskTags`)
      .send(createTaskTagData.valid);
  });

  afterEach(async () => {
    if (await sequelize.models.TaskTag.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/taskTags`).query({ id: 1 });
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /task tags", async () => {
    const res = await request(app)
      .get(`${apiBaseUrl}/taskTags`)
      .send({ difficulty_clearance_level: 10 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.taskTags).toStrictEqual([
      {
        ...createTaskTagData.valid,
        id: 1,
        task_difficulty_level: createTaskData.valid.difficulty_level,
      },
    ]);
  });

  test("GET /task tags without difficulty_clearance_level", async () => {
    const res = await request(app).get(`${apiBaseUrl}/taskTags`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /task tags with invalid difficulty_clearance_level", async () => {
    for (const invalid of getTaskTagData.invalidDifficultyClearanceList) {
      const res = await request(app)
        .get(`${apiBaseUrl}/taskTags`)
        .send({ difficulty_clearance_level: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("GET /task tags with too low difficulty_clearance_level", async () => {
    const res = await request(app).get(`${apiBaseUrl}/taskTags`).send({
      difficulty_clearance_level: 0,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No task tags found");
  });
});
