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

function generateVerificationToken(userId) {
  const secret = process.env.JWT_VERIFICATION_SECRET;
  const id = userId;
  const expiresIn = "60m";
  return jwt.sign(
    {
      id,
    },
    secret,
    {
      expiresIn,
    }
  );
}

function verifyVerificationToken(token) {
  const secret = process.env.JWT_VERIFICATION_SECRET;
  return jwt.verify(token, secret);
}

function generateUserActivationToken(userId) {
  const secret = process.env.JWT_USER_ACTIVATION_SECRET;
  const id = userId;
  const expiresIn = "3d";
  return jwt.sign(
    {
      id,
    },
    secret,
    {
      expiresIn,
    }
  );
}

function verifyUserActivationToken(token) {
  const secret = process.env.JWT_USER_ACTIVATION_SECRET;
  return jwt.verify(token, secret);
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

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateJWT,
  generateRefreshJWT,
  verifyJWT,
  generateVerificationToken,
  verifyVerificationToken,
  generateUserActivationToken,
  verifyUserActivationToken,
};
