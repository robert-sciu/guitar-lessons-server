const jwt = require("jsonwebtoken");
const { handleErrorResponse } = require("./controllerUtilites");

function authenticateJWT(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return handleErrorResponse(res, 401, "No token, authorization denied");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return handleErrorResponse(res, 401, "Token is not valid");
  }
}

module.exports = { authenticateJWT };
