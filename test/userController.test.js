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
  },
  missing: {
    name: "Test User",
    email: "test@example.com",
    password: "",
    role: "student",
  },
  invalid: {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "invalid",
  },
};

const userUpdateData = {
  valid: {
    user_id: 1,
    difficulty_clearance_level: 1,
    is_confirmed: true,
  },
  invalid_id_list: ["invalid", 0, "1n", undefined, null, "", true, false, NaN],
  invalid_difficulty_clearance_list: [
    "invalid",
    "clearance",
    undefined,
    null,
    "",
    true,
    false,
    NaN,
  ],
  invalid_confirmed_list: [
    "invalid",
    "confirmed",
    0,
    1,
    undefined,
    null,
    "",
    NaN,
  ],
};

describe("User Controller", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Synchronize database
  });

  afterAll(async () => {
    await sequelize.close(); // Close database connection
  });

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

  test("POST /user with missing data", async () => {
    const res = await request(app).post("/api/v1/users").send(userData.missing);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /user with invalid data", async () => {
    const res = await request(app).post("/api/v1/users").send(userData.invalid);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /user with no data", async () => {
    const res = await request(app).post("/api/v1/users").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /user with duplicate email", async () => {
    const res = await request(app).post("/api/v1/users").send(userData.valid);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /user with valid parameters", async () => {
    const res = await request(app)
      .patch("/api/v1/users")
      .send(userUpdateData.valid);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User updated successfully");
  });

  test("PATCH /user with invalid id parameter", async () => {
    for (const invalid of userUpdateData.invalid_id_list) {
      const res = await request(app)
        .patch("/api/v1/users")
        .send({ ...userUpdateData.valid, user_id: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid user ID");
    }
  });

  test("PATCH /user with invalid clearance parameter", async () => {
    for (const invalid of userUpdateData.invalid_difficulty_clearance_list) {
      const res = await request(app)
        .patch("/api/v1/users")
        .send({ ...userUpdateData.valid, difficulty_clearance_level: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid difficulty clearance level");
    }
  });

  test("PATCH /user with invalid confirmed parameter", async () => {
    for (const invalid of userUpdateData.invalid_confirmed_list) {
      const res = await request(app)
        .patch("/api/v1/users")
        .send({ ...userUpdateData.valid, is_confirmed: invalid });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid confirmation value");
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
});
