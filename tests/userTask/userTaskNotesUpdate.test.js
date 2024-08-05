require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createUserTaskData } = require("./data");

const {
  createTestTask,
  createTestUser,
  deleteTestDbEntry,
} = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("PATCH /userTasks", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    await createTestTask();

    await createTestUser();

    await request(app)
      .post(`${apiBaseUrl}/userTasks`)
      .send(createUserTaskData.valid);
  });
  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.UserTask, "userTasks");
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /userTasks with valid data", async () => {
    for (const valid_user_notes of createUserTaskData.validUserNotesList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/userTasks/userNotes`)
        .send({
          user_id: 1,
          task_id: 1,
          user_notes: valid_user_notes,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    }
  });

  test("PATCH /userTasks with invalid user id", async () => {
    for (const invalid of createUserTaskData.invalid.userIdList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/userTasks/userNotes`)
        .send({
          user_id: invalid,
          task_id: 1,
          user_notes: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /userTasks with invalid task id", async () => {
    for (const invalid of createUserTaskData.invalid.taskIdList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/userTasks/userNotes`)
        .send({
          user_id: 1,
          task_id: invalid,
          user_notes: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
