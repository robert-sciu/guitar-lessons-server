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
    handleErrorResponse(res, 400, "Token is not valid");
  }
}

function generateJWT(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

function generateRefreshJWT(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

module.exports = { authenticateJWT, generateJWT, generateRefreshJWT };
