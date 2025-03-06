const login = require("./login");
const logout = require("./logout");
const refreshToken = require("./refreshToken");
const verifyToken = require("./verifyToken");
const verifyAdminToken = require("./verifyAdminToken");

module.exports = {
  login,
  logout,
  refreshToken,
  verifyToken,
  verifyAdminToken,
};
