require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const { createUserData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("User Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.User, "users");
  });
  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error("Error closing sequelize:", error);
    }
  });

  test("POST /user with valid data", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User created successfully");
    const user = await sequelize.models.User.findOne({
      where: { email: createUserData.validStudent.email },
    });
    expect(user).not.toBeNull();
    expect(user.username).toBe(createUserData.validStudent.username);
    expect(user.role).toBe(createUserData.validStudent.role);
    expect(user.password).not.toBe(createUserData.validStudent.password);
    expect(user.email).toBe(createUserData.validStudent.email);
    expect(user.difficulty_clearance_level).toBe(
      createUserData.defaultValues.difficulty_clearance_level
    );
    expect(user.is_confirmed).toBe(createUserData.defaultValues.is_confirmed);
  });
  test("POST /user with duplicate email", async () => {
    await sequelize.models.User.create({
      ...createUserData.validStudent,
      ...createUserData.defaultValues,
    });
    const res = await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
  test("POST /user creates admin when CREATE_ADMIN_USER_ENABLED is true", async () => {
    process.env.CREATE_ADMIN_USER_ENABLED = "true";
    const res = await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validAdmin);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User created successfully");
    const user = await sequelize.models.User.findOne({
      where: { email: createUserData.validAdmin.email },
    });
    expect(user).not.toBeNull();
    expect(user.username).toBe(createUserData.validAdmin.username);
    expect(user.role).toBe(createUserData.validAdmin.role);
  });
  test("POST /user fails to create admin when CREATE_ADMIN_USER_ENABLED is false", async () => {
    process.env.CREATE_ADMIN_USER_ENABLED = "false";
    const res = await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validAdmin);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Creating admin user is disabled");
    const user = await sequelize.models.User.findOne({
      where: { email: createUserData.validAdmin.email },
    });
    expect(user).toBeNull();
  });
  test.each(createUserData.invalidNameList)(
    "POST /user with invalid username",
    async (invalid) => {
      const res = await request(app)
        .post(`${apiBaseUrl}/users`)
        .send({ ...createUserData.validStudent, username: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
  test.each(createUserData.invalidEmailList)(
    "POST /user with invalid email",
    async (invalid) => {
      const res = await request(app)
        .post(`${apiBaseUrl}/users`)
        .send({ ...createUserData.validStudent, email: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
  test.each(createUserData.invalidPasswordList)(
    "POST /user with invalid password",
    async (invalid) => {
      const res = await request(app)
        .post(`${apiBaseUrl}/users`)
        .send({ ...createUserData.validStudent, password: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
  test.each(createUserData.invalidRoleList)(
    "POST /user with invalid role",
    async (invalid) => {
      const res = await request(app)
        .post(`${apiBaseUrl}/users`)
        .send({ ...createUserData.validStudent, role: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
  test("POST /user with no data", async () => {
    const res = await request(app).post(`${apiBaseUrl}/users`).send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
  /////// RESET PASSWORD /////////
  test("/POST /reset_password_request with valid email", async () => {
    await request(app)
      .post(`${apiBaseUrl}/users`)
      .send(createUserData.validStudent);
    const res = await request(app)
      .post(`${apiBaseUrl}/users/reset_password`)
      .send({
        email: createUserData.validStudent.email,
      });
    const { reset_password_token, reset_password_token_expiry } =
      await sequelize.models.User.findOne({
        where: { email: createUserData.validStudent.email },
      });
    expect(reset_password_token).not.toBeNull();
    expect(reset_password_token_expiry).not.toBeNull();
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Password reset token sent");
  });
  test.each(createUserData.invalidEmailList)(
    "POST /reset_password_request with invalid email",
    async (invalid) => {
      const res = await request(app)
        .post(`${apiBaseUrl}/users/reset_password`)
        .send({
          email: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  );
  test("POST /reset_password_request with no email", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/users/reset_password`)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
  test("POST /reset_password_request with valid email but no user", async () => {
    const res = await request(app)
      .post(`${apiBaseUrl}/users/reset_password`)
      .send({
        email: "no_such_user@mail.com",
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});
