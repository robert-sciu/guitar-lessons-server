require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createUserData, updateUserData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("UPDATE /users", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.User, "users");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /user with valid parameters", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    const res = await request(app)
      .patch(`${apiBaseUrl}/users`)
      .send(updateUserData.valid);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User updated successfully");
  });

  test("PATCH /user with difficulty clearance level parameter only", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    const user = await request(app).get(`${apiBaseUrl}/users`).query({ id: 1 });

    const res = await request(app).patch(`${apiBaseUrl}/users`).send({
      user_id: updateUserData.valid.user_id,
      difficulty_clearance_level: 1,
    });

    const updatedUser = await request(app)
      .get(`${apiBaseUrl}/users`)
      .query({ id: 1 });

    expect(updatedUser.body.data.difficulty_clearance_level).toBe(1);
    expect(
      updatedUser.body.data.is_confirmed === user.body.data.is_confirmed
    ).toBe(true);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User updated successfully");
  });

  test("PATCH /user with confirmed parameter only", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    const user = await request(app).get(`${apiBaseUrl}/users`).query({ id: 1 });

    const res = await request(app)
      .patch(`${apiBaseUrl}/users`)
      .send({ user_id: updateUserData.valid.user_id, is_confirmed: true });

    const updatedUser = await request(app)
      .get(`${apiBaseUrl}/users`)
      .query({ id: 1 });

    expect(updatedUser.body.data.is_confirmed).toBe(true);
    expect(
      updatedUser.body.data.difficulty_clearance_level ===
        user.body.data.difficulty_clearance_level
    ).toBe(true);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User updated successfully");
  });

  test("PATCH / user with invalid id parameter", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    const res = await request(app)
      .patch(`${apiBaseUrl}/users`)
      .send({ ...updateUserData.valid, user_id: "invalid" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /user with invalid clearance parameter", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    for (const invalid of updateUserData.invalidDifficultyClearanceList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/users`)
        .send({ ...updateUserData.valid, difficulty_clearance_level: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /user with invalid confirmed parameter", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    for (const invalid of updateUserData.invalidConfirmedList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/users`)
        .send({ ...updateUserData.valid, is_confirmed: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /user with no parameters", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/users`)
      .send({ user_id: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No update data provided");
  });

  test("PATCH /no user", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/users`)
      .send({ ...updateUserData.valid, user_id: 9999 });

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  test("PATCH /reset_password with valid parameters", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    await request(app).post(`${apiBaseUrl}/users/reset_password`).send({
      email: createUserData.validStudent.email,
    });

    const { reset_password_token, reset_password_token_expiry } =
      await sequelize.models.User.findOne({
        where: { email: createUserData.validStudent.email },
      });

    const res = await request(app)
      .patch(`${apiBaseUrl}/users/reset_password`)
      .send({
        email: createUserData.validStudent.email,
        reset_password_token,
        password: createUserData.validStudent.password + "1",
      });

    const { password } = await sequelize.models.User.findOne({
      where: { email: createUserData.validStudent.email },
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Password updated successfully");
  });

  test("PATCH /reset_password with invalid token", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    const res = await request(app)
      .patch(`${apiBaseUrl}/users/reset_password`)
      .send({
        email: createUserData.validStudent.email,
        reset_password_token: "invalid",
        password: createUserData.validStudent.password + "1",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid token");
  });

  test("PATCH /reset_password with no user", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/users/reset_password`)
      .send({
        email: "no_such_user@mail.com",
        reset_password_token: "invalid",
        password: "password123",
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /reset_password with no password", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    await request(app).post(`${apiBaseUrl}/users/reset_password`).send({
      email: createUserData.validStudent.email,
    });
    const { reset_password_token, reset_password_token_expiry } =
      await sequelize.models.User.findOne({
        where: { email: createUserData.validStudent.email },
      });

    const res = await request(app)
      .patch(`${apiBaseUrl}/users/reset_password`)
      .send({
        email: createUserData.validStudent.email,
        reset_password_token,
        password: "",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /reset_password with no token", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);

    const res = await request(app)
      .patch(`${apiBaseUrl}/users/reset_password`)
      .send({
        email: createUserData.validStudent.email,
        reset_password_token: undefined,
        password: "new password",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
