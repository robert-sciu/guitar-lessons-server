const {
  destructureData,
  findRecordByPk,
  updateRecord,
  findRecordByValue,
  generateResetToken,
  findAllRecords,
} = require("../../utilities/controllerUtilites");
const { sendMail } = require("../../utilities/mailer");
const { userCache } = require("../../utilities/nodeCache");

const { User } = require("../../models").sequelize.models;

class UserService {
  async findAllUsers() {
    const users = await findAllRecords(User);
    if (!users) {
      return null;
    }
    const sanitizedUsers = users.map((user) => this.sanitizeUserData(user));
    return sanitizedUsers;
  }
  async findUserById(user_id) {
    const user = await findRecordByPk(User, user_id);
    return this.sanitizeUserData(user);
  }
  async findUserEmail(user_id) {
    const user = await findRecordByPk(User, user_id);
    return user.email;
  }
  async getSavedChangeEmailTokenAndNewEmail(user_id) {
    const user = await findRecordByPk(User, user_id);
    return this.destructureTokenAndNewEmail(user);
  }
  async updateUser(user_id, data) {
    return await updateRecord(User, data, user_id);
  }
  async emailIsInDatabase(email) {
    const existingEmail = await findRecordByValue(User, { email });
    if (existingEmail) {
      return true;
    }
    return false;
  }
  async sendEmailWithResetToken(email, resetToken, language) {
    if (language === "pl") {
      return await sendMail({
        email,
        subject: "Zmiana adresu Email",
        text: `Twoj kod bezpieczeństwa: ${resetToken}`,
      });
    } else if (language === "en") {
      return await sendMail({
        email,
        subject: "Change Email Address",
        text: `Your reset token is: ${resetToken}`,
      });
    } else {
      return new Error();
    }
  }
  clearUserCache(user_id) {
    userCache.del(user_id);
  }
  destructureUpdateUserDataAdmin(data) {
    return destructureData(data, [
      "difficulty_clearance_level",
      "is_confirmed",
    ]);
  }
  destructureUpdateUserDataUser(data) {
    return destructureData(data, ["username"]);
  }
  destructureEmailChangeData(data) {
    return destructureData(data, ["email", "change_email_token"]);
  }
  sanitizeUserData(data) {
    return destructureData(data, [
      "id",
      "username",
      "email",
      "difficulty_clearance_level",
      "is_confirmed",
    ]);
  }
  destructureTokenAndNewEmail(data) {
    return destructureData(data, ["new_email_temp", "change_email_token"]);
  }
}

const userService = new UserService();
module.exports = userService;
