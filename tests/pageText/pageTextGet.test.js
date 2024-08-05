require("dotenv").config();
const request = require("supertest");
const { sequelize } = require("../../models");
const app = require("../../app");
const { pageTextData } = require("./data");
const { deleteTestDbEntry } = require("../utilities/utilities");

const apiBaseUrl = process.env.API_BASE_URL;

describe("GET /pageText", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await request(app).post(`${apiBaseUrl}/pageTexts`).send(pageTextData.valid);
  });

  afterEach(async () => {
    await deleteTestDbEntry(sequelize.models.PageText, "pageTexts");
  });
  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /pageTexts", async () => {
    const res = await request(app).get(`${apiBaseUrl}/pageTexts`).send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([{ id: 1, ...pageTextData.valid }]);
  });

  test("GET /pageTexts with no data", async () => {
    await deleteTestDbEntry(sequelize.models.PageText, "pageTexts");
    const res = await request(app).get(`${apiBaseUrl}/pageTexts`).send();
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual("No page texts found");
  });
});
