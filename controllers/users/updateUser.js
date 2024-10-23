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
  let user;
  let id;
  let updateData;
  if (req.user.role === "admin") {
    const { difficulty_clearance_level, is_confirmed } =
      userService.destructureUpdateUserDataAdmin(req.body);
    updateData = { difficulty_clearance_level, is_confirmed };
    id = req.query.id;
    user = await userService.findUserById(id);
  } else if (req.user.role === "user") {
    const { username } = userService.destructureUpdateUserDataUser(req.body);
    updateData = { username };
    user = req.user;
    id = req.user.id;
  } else {
    return handleErrorResponse(
      res,
      403,
      responses.commonMessages.forbidden[language]
    );
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
      id,
      updateDataNoDuplicates
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    userService.clearUserCache(id);
    const updatedUser = await userService.findUserById(id);
    return handleSuccessResponse(res, 200, updatedUser);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, responses.commonMessages.serverError);
  }
}

module.exports = updateUser;
