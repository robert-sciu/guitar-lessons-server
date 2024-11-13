const logger = require("../../utilities/logger");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilites");
const userService = require("./userService");
const responses = require("../../responses");

async function resetPassword(req, res, next) {
  const language = req.language;
  const { email } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return handleErrorResponse(
        res,
        404,
        responses.usersMessages.userNotFound[language]
      );
    }

    const { resetToken, resetTokenExpiry } = userService.generateResetToken();

    const updatedRecordCount = await userService.saveResetPasswordToken(
      user.id,
      resetToken,
      resetTokenExpiry
    );

    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }

    await userService.sendPasswordResetEmail(email, resetToken, language);
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

module.exports = resetPassword;
