const jwt = require("jsonwebtoken");

function generateJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      difficulty_clearance_level: user.difficulty_clearance_level,
      role: user.role,
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
      difficulty_clearance_level: user.difficulty_clearance_level,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

module.exports = { generateJWT, generateRefreshJWT };
