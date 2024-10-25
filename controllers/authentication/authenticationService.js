const {
  findRecordByValue,
  createRecord,
  updateRecord,
} = require("../../utilities/controllerUtilites");
const { User, RefreshToken } = require("../../models").sequelize.models;
const bcrypt = require("bcryptjs");
const {
  generateJWT,
  generateRefreshJWT,
  verifyJWT,
} = require("../../utilities/tokenUtilities");

class AuthenticationService {
  constructor() {}
  async findUserByEmail(email) {
    return await findRecordByValue(User, { email });
  }
  async findStoredToken(token) {
    return await findRecordByValue(RefreshToken, { token, revoked: false });
  }
  async revokeToken(token) {
    return await updateRecord(RefreshToken, { revoked: true }, token.id);
  }
  async verifyPassword(hash, password) {
    return await bcrypt.compare(password, hash);
  }
  async saveRefreshToken(refreshToken, userId) {
    return await createRecord(RefreshToken, {
      token: refreshToken,
      user_id: userId,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false,
    });
  }
  attachCookies(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  clearCookies(res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  getJWT(user) {
    return generateJWT(user);
  }
  getRefreshJWT(user) {
    return generateRefreshJWT(user);
  }
  decodeJWT(token) {
    return verifyJWT(token);
  }
}

const authenticationService = new AuthenticationService();

module.exports = authenticationService;
