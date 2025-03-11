const getUser = require("./getUser");
const createUser = require("./createUser");
const createAdmin = require("./createAdmin");
const verifyUser = require("./verifyUser");
const activateUser = require("./activateUser");
const updateUser = require("./updateUser");
const resetPasswordRequest = require("./resetPasswordRequest");
const resetPassword = require("./resetPassword");
const changeEmailRequest = require("./changeEmailRequest");
const changeEmail = require("./changeEmail");

const getAllUsers = require("./admin/getAllUsers");
const updateUserAdmin = require("./admin/updateUserAdmin");
const deleteUser = require("./admin/deleteUser");

module.exports = {
  getUser,
  createUser,
  createAdmin,
  verifyUser,
  activateUser,
  updateUser,
  resetPasswordRequest,
  resetPassword,
  changeEmailRequest,
  changeEmail,
  getAllUsers,
  updateUserAdmin,
  deleteUser,
};
