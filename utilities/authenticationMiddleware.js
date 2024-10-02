const jwt = require("jsonwebtoken");
const { handleErrorResponse, findRecordByPk } = require("./controllerUtilites");
const { User } = require("../models").sequelize.models;
const NodeCache = require("node-cache");
const userCache = new NodeCache({ stdTTL: 300 });
const logger = require("../utilities/logger");

async function authenticateJWT(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return handleErrorResponse(res, 401, "No token, authorization denied");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let userData = await userCache.get(decoded.id);
    if (!userData) {
      const user = await findRecordByPk(User, decoded.id);
      const {
        password,
        reset_password_token,
        reset_password_token_expiry,
        ...userDataValues
      } = user.dataValues;
      userData = userDataValues;
      if (!userData) {
        return handleErrorResponse(res, 404, "User not found");
      }
      userCache.set(decoded.id, userData);
    }

    req.user = userData;
    next();
  } catch (error) {
    console.log(error);
    logger.error(error);
    return handleErrorResponse(res, 401, "Token is not valid");
  }
}

function verifyUserIsAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return handleErrorResponse(res, 403, "Access denied");
  }
  next();
}

module.exports = { authenticateJWT, verifyUserIsAdmin };
