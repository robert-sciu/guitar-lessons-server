const {
  handleErrorResponse,
  updateRecord,
  findRecordByValue,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const { RefreshToken } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return handleErrorResponse(res, 401, "No token");
  }
  try {
    const existingToken = await findRecordByValue(RefreshToken, {
      token: refreshToken,
      revoked: false,
    });
    if (existingToken) {
      await updateRecord(
        RefreshToken,
        {
          revoked: true,
        },
        existingToken.id
      );
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return handleSuccessResponse(res, 200, "Logout successful");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = logout;
