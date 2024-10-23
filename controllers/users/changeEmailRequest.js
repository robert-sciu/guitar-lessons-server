const {
  handleErrorResponse,
  handleSuccessResponse,
  generateResetToken,
} = require("../../utilities/controllerUtilites");
const responses = require("../../responses");
const userService = require("./userService");

async function changeEmailRequest(req, res) {
  const language = req.language;
  const user_id = req.user.id;
  const email = req.body.email;
  try {
    if (await userService.emailIsInDatabase(email)) {
      return handleErrorResponse(
        res,
        409,
        responses.usersMessages.mailInUse[language]
      );
    }
    const { resetToken, resetTokenExpiry } = generateResetToken();
    const updatedRecordCount = await userService.updateUser(user_id, {
      new_email_temp: email,
      change_email_token: resetToken,
      change_email_token_expiry: resetTokenExpiry,
    });
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    const userEmail = await userService.findUserEmail(user_id);
    await userService.sendEmailWithResetToken(userEmail, resetToken, language);
    return handleSuccessResponse(
      res,
      200,
      responses.usersMessages.tokenSent[language]
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

module.exports = changeEmailRequest;
