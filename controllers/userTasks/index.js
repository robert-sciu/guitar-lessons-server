const getUserTasks = require("./getUserTasks");
const getCompletedUserTasks = require("./getCompletedUserTasks");
const createUserTask = require("./createUserTask");
const updateUserTask = require("./updateUserTask");
const updateUserTaskNotes = require("./updateUserTaskNotes");
const deleteUserTask = require("./deleteUserTask");

module.exports = {
  getUserTasks,
  getCompletedUserTasks,
  createUserTask,
  updateUserTask,
  updateUserTaskNotes,
  deleteUserTask,
};
