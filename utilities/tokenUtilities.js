const jwt = require("jsonwebtoken");

function generateJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

function generateRefreshJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

module.exports = { generateJWT, generateRefreshJWT };
