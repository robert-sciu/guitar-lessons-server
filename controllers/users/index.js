const getUser = require("./getUser");
const createUser = require("./createUser");
const updateUser = require("./updateUser");
const deleteUser = require("./deleteUser");
const resetPasswordRequest = require("./resetPasswordRequest");
const resetPassword = require("./resetPassword");
const changeEmailRequest = require("./changeEmailRequest");
const changeEmail = require("./changeEmail");

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetPasswordRequest,
  resetPassword,
  changeEmailRequest,
  changeEmail,
};
