const User = require("../../models").sequelize.models.User;
const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  updateRecord,
  findRecordByPk,
  handleSuccessResponse,
  destructureData,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");

async function updateUser(req, res) {
  const id = req.query.id;
  const updateData = destructureData(req.body, [
    "difficulty_clearance_level",
    "is_confirmed",
  ]);
  try {
    const user = await findRecordByPk(User, id);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }
    const updateDataNoDuplicates = unchangedDataToUndefined(user, updateData);
    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(res, 400, "No update data provided");
    }

    const updatedRecordCount = await updateRecord(
      User,
      updateDataNoDuplicates,
      id
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
