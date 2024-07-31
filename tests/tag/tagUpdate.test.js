require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");

const apiBaseUrl = process.env.API_BASE_URL;

const { createTagData } = require("./data");

describe("Tag Delete Controller", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app).post(`${apiBaseUrl}/tags`).send(createTagData.valid);
  });
  afterEach(async () => {
    if (await sequelize.models.Tag.findOne({ where: { id: 1 } })) {
      await request(app).delete(`${apiBaseUrl}/tags`).query({ id: 1 });
    }
  });

  afterAll(async () => {
    sequelize.close();
  });

  test("PATCH /tags with valid query parameter", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tags`)
      .query({ id: 1 })
      .send(createTagData.validUpdate);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Tag updated successfully");
    const tag = await request(app).get(`${apiBaseUrl}/tags`).query({ id: 1 });
    expect(tag.body.tag).toStrictEqual({
      id: 1,
      ...createTagData.validUpdate,
    });
  });

  test("PATCH /tags with category only", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tags`)
      .query({ id: 1 })
      .send({ category: createTagData.validUpdate.category });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Tag updated successfully");
    const tag = await request(app).get(`${apiBaseUrl}/tags`).query({ id: 1 });
    expect(tag.body.tag).toStrictEqual({
      id: 1,
      category: createTagData.validUpdate.category,
      value: createTagData.valid.value,
    });
  });

  test("PATCH /tags with value only", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tags`)
      .query({ id: 1 })
      .send({
        value: createTagData.validUpdate.value,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Tag updated successfully");
    const tag = await request(app).get(`${apiBaseUrl}/tags`).query({ id: 1 });
    expect(tag.body.tag).toStrictEqual({
      id: 1,
      category: createTagData.valid.category,
      value: createTagData.validUpdate.value,
    });
  });

  test("PATCH /tags that does not exist", async () => {
    const res = await request(app)
      .patch(`${apiBaseUrl}/tags`)
      .query({ id: 999 });
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Tag not found");
  });

  test("PATCH /tags with no query parameter", async () => {
    const res = await request(app).patch(`${apiBaseUrl}/tags`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("PATCH /tags with invalid query parameter", async () => {
    for (const invalid of createTagData.invalidQueryList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tags`)
        .query({ id: invalid });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /tags with invalid category", async () => {
    for (const invalid of createTagData.invalidCategoryUpdateList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tags`)
        .query({ id: 1 })
        .send({
          category: invalid,
          value: createTagData.validUpdate.value,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });

  test("PATCH /tags with invalid value", async () => {
    for (const invalid of createTagData.invalidValueUpdateList) {
      const res = await request(app)
        .patch(`${apiBaseUrl}/tags`)
        .query({ id: 1 })
        .send({
          category: createTagData.valid.category,
          value: invalid,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    }
  });
});
