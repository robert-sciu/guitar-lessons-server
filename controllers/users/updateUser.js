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
  const user_id = req.id;
  let user;
  let updateData;
  if (userService.userIsAdmin(req.user)) {
    const { difficulty_clearance_level, is_confirmed_by_admin } =
      userService.destructureUpdateUserDataAdmin(req.body);
    updateData = { difficulty_clearance_level, is_confirmed_by_admin };
    user = await userService.findUserById(user_id);
  }
  if (userService.userIsUser(req.user)) {
    const { username, minimum_task_level_to_display } =
      userService.destructureUpdateUserDataUser(req.body);
    updateData = { username, minimum_task_level_to_display };
    user = req.user;
    if (Number(user.id) !== Number(user_id)) {
      return handleErrorResponse(
        res,
        403,
        responses.commonMessages.forbidden[language]
      );
    }
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
