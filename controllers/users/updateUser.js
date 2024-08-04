const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  updateRecord,
  findRecordByPk,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");

async function updateUser(req, res) {
  const { user_id, difficulty_clearance_level, is_confirmed } = req.body;
  const userUpdateData = {
    difficulty_clearance_level,
    is_confirmed,
  };
  if (checkMissingUpdateData(userUpdateData)) {
    return handleErrorResponse(res, 400, "No update data provided");
  }
  try {
    if (!(await findRecordByPk(User, user_id))) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const updatedRecordCount = await updateRecord(
      User,
      userUpdateData,
      user_id
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(res, 409, "Update failed");
    }
    return handleSuccessResponse(res, 200, "User updated successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "Server error");
  }
}

module.exports = updateUser;
