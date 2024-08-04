require("dotenv").config();
const request = require("supertest");
const app = require("../../app");

const { createTaskData } = require("../task/data");
const { createUserData } = require("../user/data");

const apiBaseUrl = process.env.API_BASE_URL;

async function createTestTask() {
  return request(app)
    .post(`${apiBaseUrl}/tasks`)
    .field("title", createTaskData.valid.title)
    .field("artist", createTaskData.valid.artist)
    .field("url", createTaskData.valid.url)
    .field("notes_pl", createTaskData.valid.notes_pl)
    .field("notes_en", createTaskData.valid.notes_en)
    .field("difficulty_level", createTaskData.valid.difficulty_level);
}

async function createTestUser() {
  return request(app)
    .post(`${apiBaseUrl}/users`)
    .send(createUserData.validStudent);
}

async function deleteTestDbEntry(model, endpoint) {
  if (await model.findOne({ where: { id: 1 } })) {
    return request(app).delete(`${apiBaseUrl}/${endpoint}`).query({ id: 1 });
  }
  return;
}

module.exports = {
  createTestTask,
  createTestUser,
  deleteTestDbEntry,
};
