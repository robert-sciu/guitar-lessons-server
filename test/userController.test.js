require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../models"); // Adjust the path according to your project structure
const app = require("../app");

const userData = {
  valid: {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "student",
    reset_password_token: null,
    reset_password_token_expiry: null,
  },
  validAdmin: {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  invalidNameList: ["", 0, "12", undefined, null, true, false, NaN],
  invalidEmailList: [
    "",
    0,
    "12",
    undefined,
    null,
    "",
    true,
    false,
    NaN,
    "@email.com",
    "user@email.",
  ],
  invalidPasswordList: ["", 0, "12sd", undefined, null, "", true, false, NaN],
};

const userUpdateData = {
  valid: {
    user_id: 1,
    difficulty_clearance_level: 1,
    is_confirmed: true,
  },
  invalidIdList: ["invalid", 0, "1n", undefined, null, "", true, false, NaN],

  invalidDifficultyClearanceList: [
    "invalid",
    "clearance",
    null,
    true,
    false,
    true,
    NaN,
  ],
  invalidConfirmedList: ["invalid", "confirmed", null, NaN],
};

const userDeleteData = {
  invalidIdList: ["invalid", 0, "1n", undefined, null, "", true, false, NaN],
};

describe("User Controller", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Synchronize database
  });

  afterAll(async () => {
    await sequelize.close(); // Close database connection
  });

  test("POST /reset_password_request with invalid email", async () => {
    const res = await request(app).post("/api/v1/users/reset_password").send({
      email: "invalid",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /reset_password_request with no email", async () => {
    const res = await request(app)
      .post("/api/v1/users/reset_password")
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /reset_password_request with valid email but no user", async () => {
    const res = await request(app).post("/api/v1/users/reset_password").send({
      email: "no_such_user@mail.com",
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  test("PATCH /reset_password with no user", async () => {
    const res = await request(app).patch("/api/v1/users/reset_password").send({
      email: "no_such_user@mail.com",
      reset_password_token: "invalid",
      password: "password123",
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /reset_password with no password", async () => {
    const res = await request(app).patch("/api/v1/users/reset_password").send({
      email: "no_such_user@mail.com",
      reset_password_token: "invalid",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /reset_password with no token", async () => {
    const res = await request(app)
      .patch("/api/v1/users/reset_password")
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /user without query parameter", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /user with invalid name", async () => {
    for (const invalid of userData.invalidNameList) {
      console.log(invalid);
      const res = await request(app)
        .post("/api/v1/users")
        .send({ ...userData.valid, name: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /user fails to create admin when CREATE_ADMIN_USER_ENABLED is false", async () => {
    process.env.CREATE_ADMIN_USER_ENABLED = "false";

    const res = await request(app)
      .post("/api/v1/users")
      .send(userData.validAdmin);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Creating admin user is disabled");

    const user = await sequelize.models.User.findOne({
      where: { email: userData.validAdmin.email },
    });
    expect(user).toBeNull();
  });

  test("POST /user with invalid email", async () => {
    for (const invalid of userData.invalidEmailList) {
      const res = await request(app)
        .post("/api/v1/users")
        .send({ ...userData.valid, email: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /user with invalid password", async () => {
    for (const invalid of userData.invalidPasswordList) {
      const res = await request(app)
        .post("/api/v1/users")
        .send({ ...userData.valid, password: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("POST /user with invalid role", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ ...userData.valid, role: "invalid" });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /user with no data", async () => {
    const res = await request(app).post("/api/v1/users").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /user with invalid id parameter", async () => {
    for (const invalid of userUpdateData.invalidIdList) {
      const res = await request(app)
        .patch("/api/v1/users")
        .send({ ...userUpdateData.valid, user_id: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /user with invalid clearance parameter", async () => {
    for (const invalid of userUpdateData.invalidDifficultyClearanceList) {
      const res = await request(app)
        .patch("/api/v1/users")
        .send({ ...userUpdateData.valid, difficulty_clearance_level: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /user with invalid confirmed parameter", async () => {
    for (const invalid of userUpdateData.invalidConfirmedList) {
      const res = await request(app)
        .patch("/api/v1/users")
        .send({ ...userUpdateData.valid, is_confirmed: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /user with no parameters", async () => {
    const res = await request(app).patch("/api/v1/users").send({ user_id: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No update data provided");
  });

  test("PATCH /no user", async () => {
    const res = await request(app)
      .patch("/api/v1/users")
      .send({ ...userUpdateData.valid, user_id: 9999 });

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  test("DELETE /no user", async () => {
    const res = await request(app).delete("/api/v1/users").query({
      id: 9999,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  test("DELETE /with invalid id", async () => {
    for (const invalid of userDeleteData.invalidIdList) {
      const res = await request(app).delete("/api/v1/users").query({
        id: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////

  // TESTS WITH VALID DATA//////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////

  test("POST /user with valid data", async () => {
    const res = await request(app).post("/api/v1/users").send(userData.valid);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User created successfully");

    const user = await sequelize.models.User.findOne({
      where: { email: userData.valid.email },
    });
    expect(user).not.toBeNull();
    expect(user.username).toBe(userData.valid.name);
    expect(user.role).toBe(userData.valid.role);
  });

  test("POST /user with duplicate email", async () => {
    const res = await request(app).post("/api/v1/users").send(userData.valid);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /user using query parameter", async () => {
    const res = await request(app).get("/api/v1/users?id=1");
    expect(res.statusCode).toEqual(200);
    expect(res.body.userData).toStrictEqual({
      id: 1,
      username: userData.valid.name,
      email: userData.valid.email,
      role: userData.valid.role,
      difficulty_clearance_level: 0,
      is_confirmed: false,
    });
  });

  test("PATCH /user with valid parameters", async () => {
    const res = await request(app)
      .patch("/api/v1/users")
      .send(userUpdateData.valid);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User updated successfully");
  });

  test("/POST /reset_password_request with valid email", async () => {
    const res = await request(app).post("/api/v1/users/reset_password").send({
      email: userData.valid.email,
    });
    const { reset_password_token, reset_password_token_expiry } =
      await sequelize.models.User.findOne({
        where: { email: userData.valid.email },
      });

    userData.valid.reset_password_token = reset_password_token;
    userData.valid.reset_password_token_expiry = reset_password_token_expiry;

    expect(reset_password_token).not.toBeNull();
    expect(reset_password_token_expiry).not.toBeNull();
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Password reset token sent");
  });

  test("PATCH /reset_password with invalid token", async () => {
    const res = await request(app)
      .patch("/api/v1/users/reset_password")
      .send({
        email: userData.valid.email,
        reset_password_token: "invalid",
        password: userData.valid.password + "1",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid token");
  });

  test("PATCH /reset_password with valid parameters", async () => {
    const res = await request(app)
      .patch("/api/v1/users/reset_password")
      .send({
        email: userData.valid.email,
        reset_password_token: userData.valid.reset_password_token,
        password: userData.valid.password + "1",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Password updated successfully");
  });

  test("DELETE /user", async () => {
    const res = await request(app).delete("/api/v1/users").query({
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User deleted successfully");
  });

  test("POST /user creates admin when CREATE_ADMIN_USER_ENABLED is true", async () => {
    process.env.CREATE_ADMIN_USER_ENABLED = "true";

    const res = await request(app)
      .post("/api/v1/users")
      .send(userData.validAdmin);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User created successfully");

    const user = await sequelize.models.User.findOne({
      where: { email: userData.validAdmin.email },
    });
    expect(user).not.toBeNull();
    expect(user.username).toBe(userData.validAdmin.name);
    expect(user.role).toBe(userData.validAdmin.role);
  });
});
