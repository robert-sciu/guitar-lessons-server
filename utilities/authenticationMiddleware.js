const jwt = require("jsonwebtoken");
const { handleErrorResponse, findRecordByPk } = require("./controllerUtilites");
const { User, PlanInfo } = require("../models").sequelize.models;
// const NodeCache = require("node-cache");
// const userCache = new NodeCache({ stdTTL: 10 });
const { userCache } = require("../utilities/nodeCache");
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
      const user = await User.findOne({
        where: {
          id: decoded.id,
        },
      });

      const {
        password,
        reset_password_token,
        reset_password_token_expiry,
        change_email_token,
        change_email_token_expiry,
        ...userDataValues
      } = user.dataValues;

      if (!userDataValues) {
        return handleErrorResponse(res, 404, "User not found");
      }

      userData = userDataValues;
      userCache.set(decoded.id, userData);
    }
    req.user = userData;
    next();
  } catch (error) {
    // console.log(error);
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
