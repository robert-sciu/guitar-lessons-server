const getUser = require("./getUser");
const createUser = require("./createUser");
const createAdmin = require("./createAdmin");
const verifyUser = require("./verifyUser");
const updateUser = require("./updateUser");
const deleteUser = require("./deleteUser");
const resetPasswordRequest = require("./resetPasswordRequest");
const resetPassword = require("./resetPassword");
const changeEmailRequest = require("./changeEmailRequest");
const changeEmail = require("./changeEmail");

module.exports = {
  getUser,
  createUser,
  createAdmin,
  verifyUser,
  updateUser,
  deleteUser,
  resetPasswordRequest,
  resetPassword,
  changeEmailRequest,
  changeEmail,
};
