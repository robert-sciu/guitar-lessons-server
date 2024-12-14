const {
  findRecordByValue,
  createRecord,
  updateRecord,
} = require("../../utilities/controllerUtilites");
const { User, UserToken } = require("../../models").sequelize.models;
const bcrypt = require("bcryptjs");
const {
  generateJWT,
  generateRefreshJWT,
  verifyJWT,
} = require("../../utilities/tokenUtilities");

class AuthenticationService {
  constructor() {}
  /**
   * Finds a user by their email address.
   * @param {string} email - The email address of the user to find.
   * @returns {Promise<User|null>} The user with the given email, or null if no user is found.
   */
  async getUserByEmail(email) {
    return await findRecordByValue(User, { email });
  }

  /**
   * Finds a stored refresh token that has not been revoked.
   * @param {string} token - The token to search for in the database.
   * @returns {Promise<RefreshToken|null>} The refresh token if found and not revoked, or null if not found.
   */
  async getStoredToken(token) {
    return await findRecordByValue(UserToken, { token, revoked: false });
  }

  /**
   * Revokes a refresh token.
   * @param {RefreshToken} token - The token to revoke.
   * @returns {Promise<RefreshToken>} The revoked token.
   */
  async revokeToken(token) {
    return await updateRecord(UserToken, { revoked: true }, token.id);
  }

  /**
   * Compares a given password with a stored hash.
   * @param {string} hash - The stored hash to compare with.
   * @param {string} password - The password to compare with the hash.
   * @returns {Promise<boolean>} Resolves with true if the password matches the hash, false otherwise.
   */

  async verifyPassword(hash, password) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Saves a refresh token for a user.
   * @param {string} refreshToken - The refresh token to save.
   * @param {number} userId - The ID of the user to associate with the refresh token.
   * @returns {Promise<RefreshToken>} The newly created refresh token record.
   */
  async saveRefreshToken(refreshToken, userId) {
    return await createRecord(UserToken, {
      token: refreshToken,
      user_id: userId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      type: "refresh",
      revoked: false,
    });
  }

  /**
   * Attaches a refresh token to a response as a cookie.
   * @param {http.ServerResponse} res - The response to attach the cookie to.
   * @param {string} refreshToken - The refresh token to attach.
   */
  attachCookies(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  /**
   * Clears the refresh token cookie from a response.
   * @param {http.ServerResponse} res - The response to clear the cookie from.
   */
  clearCookies(res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  /**
   * Generates a JSON Web Token for a given user.
   * @param {User} user - The user to generate a JWT for.
   * @returns {string} The JWT for the given user.
   */
  getJWT(user) {
    return generateJWT(user);
  }

  /**
   * Generates a refresh token JWT for a given user.
   * @param {User} user - The user to generate a refresh JWT for.
   * @returns {string} The refresh JWT for the given user.
   */
  getRefreshJWT(user) {
    return generateRefreshJWT(user);
  }

  /**
   * Verifies a given JWT and decodes it to a user object.
   * @param {string} token - The JWT to verify and decode.
   * @returns {User|null} The user object associated with the JWT, or null if the JWT is invalid.
   */
  decodeJWT(token) {
    return verifyJWT(token);
  }
}

const authenticationService = new AuthenticationService();

module.exports = authenticationService;
