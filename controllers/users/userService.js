const {
  destructureData,
  findRecordByPk,
  updateRecord,
  findRecordByValue,
  findAllRecords,
  deleteRecord,
  createRecord,
} = require("../../utilities/controllerUtilites");
const { sendMail } = require("../../utilities/mailer");
const { userCache } = require("../../utilities/nodeCache");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {
  generateVerificationToken,
  verifyVerificationToken,
  generateUserActivationToken,
  verifyUserActivationToken,
} = require("../../utilities/tokenUtilities");
const mailMessages = require("../../config/mailsData");

const { User, PlanInfo, RefreshToken, UserToken } =
  require("../../models").sequelize.models;

class UserService {
  /////////////////////////////////////////////////////////////////////////////////
  // Common functions /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  userIsAdmin(user) {
    if (user.role === "admin") {
      return true;
    }
    return false;
  }
  userIsUser(user) {
    if (user.role === "user") {
      return true;
    }
    return false;
  }
  clearUserCache(user_id) {
    userCache.del(user_id);
  }

  /////////////////////////////////////////////////////////////////////////////////
  //crypto ////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  generateResetToken() {
    const resetToken = crypto.randomInt(1000000, 9999999);
    const resetTokenExpiry = Date.now() + 60 * 15 * 1000;
    return { resetToken, resetTokenExpiry };
  }
  /**
   * Hashes a given password using bcrypt
   * @param {string} password
   * @returns {Promise<string>} The hashed password
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Database functions ///////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new user and returns the newly created user
   * @param {object} data The data to create the user with: { username, email, password, role }
   * @param {Sequelize.Transaction} transaction The transaction to create the user in
   * @returns {Promise<User>}
   */
  async createUser(data, transaction) {
    return await createRecord(User, data, transaction);
  }

  createVerificationToken(userId) {
    return generateVerificationToken(userId);
  }

  createActivationToken(userId) {
    return generateUserActivationToken(userId);
  }

  async saveVerificationToken(userId, verificationToken, transaction) {
    return await createRecord(
      UserToken,
      {
        token: verificationToken,
        user_id: userId,
        type: "verification",
        expires_at: new Date(Date.now() + 30 * 60 * 1000),
      },
      transaction
    );
  }

  async saveActivationToken(userId, activationToken) {
    return await createRecord(UserToken, {
      token: activationToken,
      user_id: userId,
      type: "activation",
      expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
  }

  verifyVerificationToken(token) {
    return verifyVerificationToken(token);
  }

  verifyActivationToken(token) {
    return verifyUserActivationToken(token);
  }

  async compareVerificationToken(token, userId) {
    const verificationToken = await UserToken.findOne({
      where: {
        token,
        user_id: userId,
        type: "verification",
      },
    });
    if (verificationToken?.dataValues?.token !== token) {
      return false;
    }
    return true;
  }

  async compareActivationToken(token, userId) {
    const activationToken = await UserToken.findOne({
      where: {
        token,
        user_id: userId,
        type: "activation",
      },
    });
    if (activationToken?.dataValues?.token !== token) {
      return false;
    }
    return true;
  }

  async setUserVerified(user_id) {
    return await updateRecord(User, { is_verified: true }, user_id);
  }

  async setUserActive(user_id) {
    return await updateRecord(User, { is_active: true }, user_id);
  }

  async deleteToken(token, user_id, type) {
    return await UserToken.destroy({
      where: { token: token, user_id: user_id, type: type },
    });
  }

  async sendMailWithVerificationToken(email, verificationLink, language) {
    await sendMail({
      email,
      subject: mailMessages.subjects.verificationEmail[language],
      text: `${mailMessages.content.clickVerificationLink[language]}: ${verificationLink}`,
    });
  }
  /**
   * Creates a new PlanInfo record for a given user
   * @param {number} user_id The id of the user to create the PlanInfo for
   * @param {Sequelize.Transaction} transaction The transaction to create the record in
   * @returns {Promise<PlanInfo>} The newly created PlanInfo record
   */

  async sendMailToMyselfAboutNewUser(userEmail, username) {
    await sendMail({
      email: process.env.MY_EMAIL,
      subject: `Nowy użytkownik: ${username}, (${new Date().toLocaleString(
        "pl-PL"
      )})`,
      text: `Nowy użytkownik właśnie się zarejestrował.\nImię: ${username}\nAdres email: ${userEmail} `,
    });
  }

  async sendMailToMyselfAboutUserVerification(
    userEmail,
    username,
    activationLink
  ) {
    await sendMail({
      email: process.env.MY_EMAIL,
      subject: `Weryfikacja użytkownika: ${username}, (${new Date().toLocaleString(
        "pl-PL"
      )})`,
      text: `Nowy użytkownik właźnie się zweryfikował.\nImię: ${username}\nAdres email: ${userEmail}\nLink aktywacyjny: ${activationLink}`,
    });
  }
  async createPlanInfo(user_id, transaction) {
    return await createRecord(PlanInfo, { user_id }, transaction);
  }

  /**
   * Finds a user by email address
   * @param {string} email The email address of the user to find
   * @returns {Promise<User>} The user with the given email, or null if none is found
   */

  /**
   * Finds a user by their email address and returns the user's reset_password_token and id
   * @param {string} email The email address of the user to find
   * @returns {Promise<{ resetPasswordToken: string, userId: number }|null>}
   * The user with the given email, or null if none is found
   */
  async getResetPasswordToken(email) {
    const user = await findRecordByValue(User, { email });
    if (!user) {
      return null;
    }
    return { resetPasswordToken: user.reset_password_token, userId: user.id };
  }
  /**
   * Finds all users in the database
   * @returns {Promise<Array<User>>} An array of all users in the database, or null if none are found
   */
  async findAllUsers() {
    const users = await findAllRecords(User);
    if (!users) {
      return null;
    }
    const sanitizedUsers = users.map((user) => this.sanitizeUserData(user));
    return sanitizedUsers;
  }
  /**
   * Updates the given user's reset_password_token and reset_password_token_expiry values
   * @param {number} user_id The id of the user to update
   * @param {string} resetToken The new value for reset_password_token
   * @param {Date} resetTokenExpiry The new value for reset_password_token_expiry
   * @returns {Promise<number>} The number of affected rows (should be 1)
   */
  async saveResetPasswordToken(user_id, resetToken, resetTokenExpiry) {
    return await updateRecord(
      User,
      {
        reset_password_token: resetToken,
        reset_password_token_expiry: resetTokenExpiry,
      },
      user_id
    );
  }

  /**
   * Finds a user by id and returns the sanitized user data
   * @param {number} user_id The id of the user to find
   * @param {Sequelize.Transaction} [transaction] The transaction to use
   * @returns {Promise<User|undefined>} The sanitized user data, or undefined if no user was found
   */
  async findUserById(user_id, transaction) {
    const user = await findRecordByPk(User, user_id, transaction);
    return this.sanitizeUserData(user);
  }
  /**
   * Deletes a user by user id
   * @param {number} user_id The id of the user to delete
   * @param {Sequelize.Transaction} [transaction] The transaction to use
   * @returns {Promise<number>} The number of affected rows (should be 1)
   */
  async deleteUser(user_id, transaction) {
    return await deleteRecord(User, user_id, transaction);
  }
  /**
   * Deletes a PlanInfo record by user id
   * @param {number} user_id The id of the user whose PlanInfo to delete
   * @param {Sequelize.Transaction} [transaction] The transaction to use
   * @returns {Promise<number>} The number of affected rows (should be 1)
   */
  async deletePlanInfo(user_id, transaction) {
    return await deleteRecord(PlanInfo, user_id, transaction);
  }
  /**
   * Finds a user by id and returns the user's email
   * @param {number} user_id The id of the user to find
   * @returns {Promise<string|undefined>} The email of the user, or undefined if no user was found
   */

  /**
   * Deletes all refresh tokens for a given user
   * @param {number} user_id The id of the user to delete the refresh tokens for
   * @param {Sequelize.Transaction} [transaction] The transaction to use
   * @returns {Promise<void>}
   */
  async deleteUserRefreshTokens(user_id, transaction) {
    const tokens = await findAllRecords(RefreshToken, { user_id }, transaction);
    if (!tokens) {
      return;
    }
    for (const token of tokens) {
      await deleteRecord(RefreshToken, token.id, transaction);
    }
  }
  async findUserEmail(user_id) {
    const user = await findRecordByPk(User, user_id);
    if (!user) {
      return undefined;
    }
    return user.email;
  }
  /**
   * Finds a user by id and returns an object with the user's change email token and new email
   * @param {number} user_id The id of the user to find
   * @returns {Promise<{changeEmailToken: string, newEmail: string}|undefined>} The object with the change email token and new email,
   * or undefined if no user was found
   */
  async getSavedChangeEmailTokenAndNewEmail(user_id) {
    const user = await findRecordByPk(User, user_id);
    return this.destructureTokenAndNewEmail(user);
  }

  /**
   * Updates a user by user id
   * @param {number} user_id The id of the user to update
   * @param {object} data The data to update the user with
   * @returns {Promise<number>} The number of affected rows (should be 1)
   */
  async updateUser(user_id, data) {
    return await updateRecord(User, data, user_id);
  }
  /**
   * Updates a user's password and clears the user's reset password token and token expiry date
   * @param {number} user_id The id of the user to update
   * @param {string} password The new password to set
   * @returns {Promise<number>} The number of affected rows (should be 1)
   */
  async updateUserPassword(user_id, password) {
    return await updateRecord(
      User,
      {
        password,
        reset_password_token: null,
        reset_password_token_expiry: null,
      },
      user_id
    );
  }
  /**
   * Checks if the given email is in the database
   * @param {string} email The email to check
   * @param {Sequelize.Transaction} [transaction] The transaction to use
   * @returns {Promise<boolean>} true if the email is in the database, false otherwise
   */
  async emailIsInDatabase(email, transaction) {
    const existingEmail = await findRecordByValue(User, { email }, transaction);
    if (existingEmail) {
      return true;
    }
    return false;
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Email functions //////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  /**
   * Sends an email with a reset token to the given email address
   * @param {string} email The email address to send the email to
   * @param {string} resetToken The reset token to include in the email
   * @param {string} language The language to use in the email
   * @returns {Promise<void>} The email has been sent
   */
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
  /**
   * Sends an email with a reset token to the given email address
   * @param {string} email The email address to send the email to
   * @param {string} resetToken The reset token to include in the email
   * @param {string} language The language to use in the email
   * @returns {Promise<void>} The email has been sent
   */
  async sendPasswordResetEmail(email, resetToken, language) {
    if (language === "pl") {
      return await sendMail({
        email,
        subject: "Zmiana hasła",
        text: `Twoj kod bezpieczeństwa: ${resetToken}`,
      });
    } else if (language === "en") {
      return await sendMail({
        email,
        subject: "Change Password",
        text: `Your reset token is: ${resetToken}`,
      });
    } else {
      return new Error();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Destructuring functions //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  // Destructure functions for different user data objects
  sanitizeUserData(data) {
    return destructureData(data, [
      "id",
      "username",
      "email",
      "difficulty_clearance_level",
      "is_confirmed_by_admin",
      "is_verified",
      "role",
      "minimum_task_level_to_display",
    ]);
  }
  destructureCreateUserData(data) {
    return destructureData(data, ["username", "email", "password"]);
  }
  destructureCreateUserDataAdmin(data) {
    return destructureData(data, ["username", "email", "password", "token"]);
  }
  destructureUpdateUserDataAdmin(data) {
    return destructureData(data, [
      "difficulty_clearance_level",
      "is_confirmed_by_admin",
    ]);
  }
  destructureUpdateUserDataUser(data) {
    return destructureData(data, ["username", "minimum_task_level_to_display"]);
  }
  destructureEmailChangeData(data) {
    return destructureData(data, ["email", "change_email_token"]);
  }
  destructurePasswordResetData(data) {
    return destructureData(data, ["email", "password", "reset_password_token"]);
  }
  destructureTokenAndNewEmail(data) {
    return destructureData(data, ["new_email_temp", "change_email_token"]);
  }
}

const userService = new UserService();
module.exports = userService;
