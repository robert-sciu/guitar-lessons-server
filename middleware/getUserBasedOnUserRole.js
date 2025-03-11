const userService = require("../controllers/users/userService");

async function getUserBasedOnRole(req) {
  if (req.user.role === "admin" && req.id) {
    return await userService.findUserById(req.id);
  } else {
    return await userService.findUserById(req.user.id);
  }
}

module.exports = { getUserBasedOnRole };
