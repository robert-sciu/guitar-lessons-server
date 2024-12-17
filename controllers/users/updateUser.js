const logger = require("../../utilities/logger");
const {
  checkMissingUpdateData,
  handleErrorResponse,
  handleSuccessResponse,
  unchangedDataToUndefined,
} = require("../../utilities/controllerUtilites");
const userService = require("./userService");
const responses = require("../../responses");

async function updateUser(req, res) {
  const language = req.language;
  const user_id = req.user.id;

  const updateData = userService.destructureUpdateUserDataUser(req.body);

  try {
    const user = await userService.findUserById(user_id);
    const updateDataNoDuplicates = unchangedDataToUndefined(user, updateData);
    if (checkMissingUpdateData(updateDataNoDuplicates)) {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.noUpdateData[language]
      );
    }
    const updatedRecordCount = await userService.updateUser(
      user_id,
      updateDataNoDuplicates
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    userService.clearUserCache(user_id);
    return handleSuccessResponse(
      res,
      200,
      responses.commonMessages.updateSuccess[language]
    );
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = updateUser;
