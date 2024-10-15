const {
  updateRecord,
  handleErrorResponse,
  handleSuccessResponse,
  findRecordByValue,
  generateResetToken,
} = require("../../utilities/controllerUtilites");
const { User } = require("../../models").sequelize.models;
const { sendMail } = require("../../utilities/mailer");
const responses = require("../../responses");

async function changeEmailRequest(req, res) {
  const language = req.language;
  const id = req.user.id;
  const email = req.body.email;

  try {
    const existingEmail = await findRecordByValue(User, { email });

    if (existingEmail) {
      return handleErrorResponse(
        res,
        409,
        responses.usersMessages.mailInUse[language]
      );
    }
    const { resetToken, resetTokenExpiry } = generateResetToken();
    const updatedRecordCount = await updateRecord(
      User,
      {
        change_email_token: resetToken,
        change_email_token_expiry: resetTokenExpiry,
      },
      id
    );
    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    await sendMail(
      {
        pl: {
          email,
          subject: "Zmiana adresu Email",
          text: `Twój kod bezpieczeństwa: ${resetToken}`,
        },
        en: {
          email,
          subject: "Change Email",
          text: `Your reset token is: ${resetToken}`,
        },
      }[language]
    );
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
