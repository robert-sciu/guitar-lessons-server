require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const config = require("../../config/config")[process.env.NODE_ENV];

const apiBaseUrl = process.env.API_BASE_URL;

const { updatePlanInfoData, planInfoData } = require("./data");
const { createTestUser, deleteTestDbEntry } = require("../utilities/utilities");

describe("PATCH /planInfo", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestUser();
  });

  afterEach(async () => {
    await request(app).delete(`${apiBaseUrl}/lessonReservations`).query({
      id: 1,
    });
    await request(app).delete(`${apiBaseUrl}/lessonReservations`).query({
      id: 2,
    });
    await deleteTestDbEntry(sequelize.models.User, "users");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("PATCH /planInfo with valid data", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({ user_id: updatePlanInfoData.valid.user_id })
      .send(updatePlanInfoData.valid);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).query({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data).toEqual({
      id: 1,
      ...updatePlanInfoData.valid,
      plan_discount: config.config.planInfo.permanentPlanDiscountPercent,
      regular_discount: 0,
      special_discount: 0,
    });
  });

  test("PATCH /planInfo with valid has permanent reservation value but not data", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({ user_id: updatePlanInfoData.valid.user_id })
      .send({
        has_permanent_reservation:
          updatePlanInfoData.valid.has_permanent_reservation,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).query({
      user_id: updatePlanInfoData.valid.user_id,
    });

    expect(res2.body.data.has_permanent_reservation).toBe(false);
  });

  test("PATCH /planInfo with only valid permanent reservation data weekday", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({ user_id: updatePlanInfoData.valid.user_id })
      .send({
        permanent_reservation_weekday:
          updatePlanInfoData.valid.permanent_reservation_weekday,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).query({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data.permanent_reservation_weekday).toBe(null);
  });

  test("PATCH /planInfo with valid permanent reservation data hour only", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({ user_id: updatePlanInfoData.valid.user_id })
      .send({
        permanent_reservation_hour:
          updatePlanInfoData.valid.permanent_reservation_hour,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).query({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data.permanent_reservation_hour).toBe(null);
  });

  test("PATCH /planInfo with valid permanent reservation data length only", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({ user_id: updatePlanInfoData.valid.user_id })
      .send({
        permanent_reservation_lesson_length:
          updatePlanInfoData.valid.permanent_reservation_lesson_length,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);

    const res2 = await request(app).get(`${apiBaseUrl}/planInfo`).query({
      user_id: updatePlanInfoData.valid.user_id,
    });
    expect(res2.body.data.permanent_reservation_lesson_length).toBe(null);
  });

  test("PATCH /planInfo with no user", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({ user_id: 999 })
      .send(updatePlanInfoData.validUpdate);
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Plan info not found");
  });

  test("PATCH /planInfo with invalid user_id", async () => {
    for (const invalid of updatePlanInfoData.invalidIdList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/planInfo`)
        .query({ user_id: invalid })
        .send(updatePlanInfoData.validUpdate);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo without user_id", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({})
      .send(updatePlanInfoData.validUpdate);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /planInfo with invalid permanent reservation weekday", async () => {
    for (const invalid of updatePlanInfoData.invalidWeekdayList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/planInfo`)
        .query({ user_id: updatePlanInfoData.valid.user_id })
        .send({
          ...updatePlanInfoData.validUpdate,
          permanent_reservation_weekday: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid permanent reservation hour", async () => {
    for (const invalid of updatePlanInfoData.invalidHourList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/planInfo`)
        .query({ user_id: updatePlanInfoData.valid.user_id })
        .send({
          ...updatePlanInfoData.validUpdate,
          permanent_reservation_hour: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid permanent reservation length", async () => {
    for (const invalid of updatePlanInfoData.invalidLengthList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/planInfo`)
        .query({ user_id: updatePlanInfoData.valid.user_id })
        .send({
          ...updatePlanInfoData.validUpdate,
          permanent_reservation_lesson_length: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid special discount", async () => {
    for (const invalid of updatePlanInfoData.invalidDiscountList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/planInfo`)
        .query({ user_id: updatePlanInfoData.valid.user_id })
        .send({
          ...updatePlanInfoData.validUpdate,
          special_discount: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with invalid has permanent reservation", async () => {
    for (const invalid of updatePlanInfoData.invalidHasPermanentReservationList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/planInfo`)
        .query({ user_id: updatePlanInfoData.valid.user_id })
        .send({
          ...updatePlanInfoData.validUpdate,
          has_permanent_reservation: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /planInfo with permanent reservation on and single values", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({ user_id: updatePlanInfoData.valid.user_id })
      .send(updatePlanInfoData.valid);
    expect(res.statusCode).toEqual(200);

    const res1 = await request(app)
      .patch(`${apiBaseUrl}/planInfo`)
      .query({
        user_id: updatePlanInfoData.valid.user_id,
      })
      .send({
        has_permanent_reservation: true,
        permanent_reservation_weekday:
          updatePlanInfoData.validUpdate.permanent_reservation_weekday,
        permanent_reservation_hour:
          updatePlanInfoData.validUpdate.permanent_reservation_hour,
        permanent_reservation_minute:
          updatePlanInfoData.validUpdate.permanent_reservation_minute,
        permanent_reservation_lesson_length:
          updatePlanInfoData.validUpdate.permanent_reservation_lesson_length,
      });

    expect(res1.statusCode).toEqual(200);
  });
});
