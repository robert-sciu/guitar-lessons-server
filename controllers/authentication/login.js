const {
  handleErrorResponse,
  handleSuccessResponse,
  findRecordByValue,
  createRecord,
} = require("../../utilities/controllerUtilites");
const { User, RefreshToken } = require("../../models").sequelize.models;
const bcrypt = require("bcryptjs");
const logger = require("../../utilities/logger");
const {
  generateJWT,
  generateRefreshJWT,
} = require("../../utilities/tokenUtilities");

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return handleErrorResponse(res, 400, "Email and password are required");
    }
    const user = await findRecordByValue(User, {
      email,
    });
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handleErrorResponse(res, 401, "Invalid email or password");
    }
    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshJWT(user);

    await createRecord(RefreshToken, {
      token: refreshToken,
      user_id: user.id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return handleSuccessResponse(res, 200, { token: accessToken });
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = login;
