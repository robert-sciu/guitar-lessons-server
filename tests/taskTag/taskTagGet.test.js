require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { createTaskTagData, getTaskTagData } = require("./data");
const { createTagData } = require("../tag/data");
const { createTaskData } = require("../task/data");
const { createTestTask, deleteTestDbEntry } = require("../utilities/utilities");

describe("GET /taskTags", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestTask();

    await request(app).post(`${apiBaseUrl}/tags`).send(createTagData.valid);

    await request(app)
      .post(`${apiBaseUrl}/taskTags`)
      .send(createTaskTagData.valid);
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.TaskTag, "taskTags");
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
    expect(res.body.data).toStrictEqual([
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
