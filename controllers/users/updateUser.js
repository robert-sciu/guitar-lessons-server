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
const { userCache } = require("../../utilities/nodeCache");

const responses = require("../../responses");

async function updateUser(req, res) {
  const language = req.language;
  let user;
  let id;
  let updateData;
  if (req.user.role === "admin") {
    updateData = destructureData(req.body, [
      "difficulty_clearance_level",
      "is_confirmed",
    ]);
    id = req.query.id;
    user = await findRecordByPk(User, id);
  }

  if (req.user.role === "user") {
    updateData = destructureData(req.body, ["username"]);
    user = req.user;
    id = req.user.id;
  }

  try {
    const updateDataNoDuplicates = unchangedDataToUndefined(user, updateData);

    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.noUpdateData[language]
      );
    }

    const updatedRecordCount = await updateRecord(
      User,
      updateDataNoDuplicates,
      id
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    userCache.del(id);
    const updatedUser = await findRecordByPk(User, id);
    const userData = destructureData(updatedUser, [
      "id",
      "username",
      "email",
      "role",
      "difficulty_clearance_level",
      "is_confirmed",
    ]);
    return handleSuccessResponse(res, 200, userData);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, responses.commonMessages.serverError);
  }
}

module.exports = updateUser;
