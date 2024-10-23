const logger = require("../../utilities/logger");
const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilites");
const responses = require("../../responses");
const userService = require("./userService");

async function changeEmail(req, res) {
  const language = req.language;
  const user_id = req.user.id;
  const { change_email_token } = userService.destructureEmailChangeData(
    req.body
  );
  try {
    const { change_email_token: saved_change_email_token, new_email_temp } =
      await userService.getSavedChangeEmailTokenAndNewEmail(user_id);
    if (saved_change_email_token !== change_email_token) {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.invalidToken[language]
      );
    }
    const updatedRecordCount = await userService.updateUser(user_id, {
      email: new_email_temp,
      change_email_token: null,
      change_email_token_expiry: null,
      new_email_temp: null,
    });
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    userService.clearUserCache(user_id);
    const updatedUser = await userService.findUserById(user_id);
    return handleSuccessResponse(res, 200, updatedUser);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      responses.commonMessages.serverError[language]
    );
  }
}

module.exports = changeEmail;
