const {
  destructureData,
  createRecord,
  findAllRecords,
  findRecordByPk,
  findRecordByFk,
  updateRecord,
  deleteRecord,
} = require("../../utilities/controllerUtilites");
const { LessonReservation, PlanInfo } =
  require("../../models").sequelize.models;
const moment = require("moment-timezone");
const {
  checkIfReservationDateIsAllowed,
  checkForOverlapingReservations,
} = require("../../utilities/lessonReservationControllerUtilities");
const { Op } = require("sequelize");

class LessonReservationsService {
  /**
   * Determines if the given user has an admin role.
   *
   * @param {Object} user - The user object to check.
   * @returns {boolean} - Returns true if the user's role is "admin", false otherwise.
   */
  userIsAdmin(user) {
    return user.role === "admin";
  }
  /**
   * Checks if the given user has a role of "user".
   *
   * @param {Object} user - The user object to check.
   * @returns {boolean} - Returns true if the user's role is "user", false otherwise.
   */
  userIsUser(user) {
    return user.role === "user";
  }

  /**
   * Verifies if the given reservation data is valid and doesn't conflict with existing reservations.
   *
   * @param {object} data - The reservation data to verify.
   * Must contain start_UTC and end_UTC properties in ISO 8601 format.
   *
   * @returns {Promise<object>}
   * A promise resolving to an object with an error property set to true if there's an error
   * and an errorMsg property with a string containing a description of the error.
   * If there's no error, the promise resolves to an object with an error property set to false
   * and an errorMsg property set to null.
   */
  async veryfyReservationData(data) {
    const { error, errorMsg } = checkIfReservationDateIsAllowed(data);
    if (error) {
      return { error: true, errorMsg };
    }
    const { error: conflictError, errorMsg: conflictErrorMsg } =
      await checkForOverlapingReservations(data);
    if (conflictError) {
      return { error: true, errorMsg: conflictErrorMsg };
    }
    return { error: false, errorMsg: null };
  }
  /**
   * Creates a LessonReservation in the database.
   * @param {Object} data - an object containing the data to create the reservation with.
   * @returns {Promise<LessonReservation>} a promise resolving to the created LessonReservation
   */

  async createReservation(data) {
    return await createRecord(LessonReservation, data);
  }

  /**
   * Finds all LessonReservations in the database.
   * @returns {Promise<LessonReservation[]>} a promise resolving to an array of all LessonReservations
   */
  async getAllReservations() {
    return await LessonReservation.findAll({
      attributes: [
        "id",
        "user_id",
        ["username", "title"],
        ["start_UTC", "start"],
        ["end_UTC", "end"],
        ["free_edit_expiry", "free_edit_expiry"],
        ["duration", "duration"],
      ],
    });
  }

  /**
   * Finds a LessonReservation by its id.
   * @param {number} id - the id of the LessonReservation to find
   * @returns {Promise<LessonReservation>} a promise resolving to the LessonReservation with the given id, or null if no such reservation exists
   */
  async getReservationById(id) {
    return await findRecordByPk(LessonReservation, id);
  }

  /**
   * Finds a user's PlanInfo record
   * @param {number} user_id - the id of the user to find the PlanInfo for
   * @returns {Promise<PlanInfo>} a promise resolving to the PlanInfo record for the given user, or null if no such record exists
   */

  async getUserPlanInfo(user_id) {
    return await findRecordByFk(PlanInfo, user_id);
  }

  /**
   * Updates the cancelled_reservations_count of a user's PlanInfo record.
   * @param {number} user_id - the id of the user to update the PlanInfo for
   * @param {number} cancelled_reservations_count - the new value for the cancelled_reservations_count column
   * @returns {Promise<PlanInfo>} a promise resolving to the updated PlanInfo record
   */
  async updateCancelledReservationsCount(user_id) {
    const planInfo = await this.getUserPlanInfo(user_id);
    const cancelled_reservations_count =
      planInfo.cancelled_reservations_count + 1;
    return await updateRecord(
      PlanInfo,
      { cancelled_reservations_count },
      user_id
    );
  }

  async updateReschedulesLeftCount(user_id) {
    const planInfo = await this.getUserPlanInfo(user_id);
    const reschedules_left_count = planInfo.reschedules_left_count - 1;
    return await updateRecord(PlanInfo, { reschedules_left_count }, user_id);
  }

  async rescheduleReservation(updateData, reservation_id) {
    return await updateRecord(LessonReservation, updateData, reservation_id);
  }

  /**
   * Deletes a LessonReservation with the given id.
   * @param {number} reservation_id - the id of the LessonReservation to delete
   * @returns {Promise<void>} a promise resolving once the LessonReservation has been deleted
   */
  async deleteReservation(reservation_id) {
    return await deleteRecord(LessonReservation, reservation_id);
  }

  async deleteFuturePermanentReservations(user_id) {
    return await LessonReservation.destroy({
      where: {
        user_id: user_id,
        is_permanent: true,
        start_UTC: {
          [Op.gte]: new Date(),
        },
      },
    });
  }

  addMinutesToNow(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now.toISOString();
  }

  /**
   * Destructures the data object into the separate values required
   * to update a lesson reservation.
   * @param {Object} data the data object to destructure
   * @returns {{start_UTC: string, end_UTC: string, duration: number}} an object with the destructured values
   */
  destructureUpdateReservationData(data) {
    return destructureData(data, ["start_UTC", "end_UTC", "duration"]);
  }

  destructureCreateReservationData(data) {
    return destructureData(data, ["start_UTC", "end_UTC", "duration"]);
  }
}

const lessonReservationsService = new LessonReservationsService();
module.exports = lessonReservationsService;
