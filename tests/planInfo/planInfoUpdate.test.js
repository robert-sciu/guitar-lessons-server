require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { updatePlanInfoData } = require("./data");
const { createTestUser, deleteTestDbEntry } = require("../utilities/utilities");

describe("Plan Info Update Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.User, "users");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /planInfo with valid data", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .send(updatePlanInfoData.valid);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data).toEqual({ id: 1, ...updatePlanInfoData.valid });
  });

  test("PATCH /planInfo with valid has permanent reservation data", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
      has_permanent_reservation:
        updatePlanInfoData.valid.has_permanent_reservation,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
    });

    expect(res2.body.data.has_permanent_reservation).toBe(
      updatePlanInfoData.valid.has_permanent_reservation
    );
  });

  test("PATCH /planInfo with valid permanent reservation data weekday", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
      permanent_reservation_weekday:
        updatePlanInfoData.valid.permanent_reservation_weekday,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data.permanent_reservation_weekday).toBe(
      updatePlanInfoData.valid.permanent_reservation_weekday
    );
  });

  test("PATCH /planInfo with valid permanent reservation data hour", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
      permanent_reservation_hour:
        updatePlanInfoData.valid.permanent_reservation_hour,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data.permanent_reservation_hour).toBe(
      updatePlanInfoData.valid.permanent_reservation_hour
    );
  });

  test("PATCH /planInfo with valid permanent reservation data length", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
      permanent_reservation_lesson_length:
        updatePlanInfoData.valid.permanent_reservation_lesson_length,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).send({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data.permanent_reservation_lesson_length).toBe(
      updatePlanInfoData.valid.permanent_reservation_lesson_length
    );
  });

  test("PATCH /planInfo with no user", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
      user_id: 999,
      permanent_reservation_weekday:
        updatePlanInfoData.valid.permanent_reservation_weekday,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Plan info not found");
  });

  test("PATCH /planInfo with invalid user_id", async () => {
    for (const invalid of updatePlanInfoData.invalidIdList) {
      const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
        user_id: invalid,
        permanent_reservation_weekday:
          updatePlanInfoData.valid.permanent_reservation_weekday,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo without user_id", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
      permanent_reservation_weekday:
        updatePlanInfoData.valid.permanent_reservation_weekday,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /planInfo with invalid permanent reservation weekday", async () => {
    for (const invalid of updatePlanInfoData.invalidWeekdayList) {
      const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
        user_id: updatePlanInfoData.valid.user_id,
        permanent_reservation_weekday: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid permanent reservation hour", async () => {
    for (const invalid of updatePlanInfoData.invalidHourList) {
      const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
        user_id: updatePlanInfoData.valid.user_id,
        permanent_reservation_hour: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid permanent reservation length", async () => {
    for (const invalid of updatePlanInfoData.invalidLengthList) {
      const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
        user_id: updatePlanInfoData.valid.user_id,
        permanent_reservation_lesson_length: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid regular discount", async () => {
    for (const invalid of updatePlanInfoData.invalidDiscountList) {
      const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
        user_id: updatePlanInfoData.valid.user_id,
        regular_discount: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid permanent discount", async () => {
    for (const invalid of updatePlanInfoData.invalidDiscountList) {
      const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
        user_id: updatePlanInfoData.valid.user_id,
        permanent_discount: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid has permanent reservation", async () => {
    for (const invalid of updatePlanInfoData.invalidHasPermanentReservationList) {
      const res = await request(app).patch(`${apiBaseUrl}/planInfo`).send({
        user_id: updatePlanInfoData.valid.user_id,
        has_permanent_reservation: invalid,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
