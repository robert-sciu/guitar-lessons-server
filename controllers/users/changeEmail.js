const { User } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");
const {
  destructureData,
  findRecordByPk,
  handleSuccessResponse,
  handleErrorResponse,
  updateRecord,
} = require("../../utilities/controllerUtilites");
const { userCache } = require("../../utilities/nodeCache");
const responses = require("../../responses");

async function changeEmail(req, res) {
  const language = req.language;
  const id = req.user.id;
  const data = destructureData(req.body, ["email", "change_email_token"]);
  const { email, change_email_token } = data;
  try {
    const user = await findRecordByPk(User, id);
    if (user.change_email_token !== change_email_token) {
      return handleErrorResponse(
        res,
        400,
        responses.commonMessages.invalidToken[language]
      );
    }
    const updatedRecordCount = await updateRecord(
      User,
      {
        email: email,
        change_email_token: null,
        change_email_token_expiry: null,
      },
      user.id
    );

    if (updatedRecordCount === 0) {
      return handleErrorResponse(
        res,
        409,
        responses.commonMessages.updateError[language]
      );
    }
    userCache.del(id);
    return handleSuccessResponse(
      res,
      200,
      responses.usersMessages.mailUpdated[language]
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

module.exports = changeEmail;
