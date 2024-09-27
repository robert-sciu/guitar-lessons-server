const { LessonReservation, User } = require("../../models/").sequelize.models;
const {
  destructureData,
  findRecordByPk,
  handleErrorResponse,
  handleSuccessResponse,
  findAllRecords,
  updateRecord,
} = require("../../utilities/controllerUtilites");

const logger = require("../../utilities/logger");
const {
  reservationsOverlap,
} = require("../../utilities/planInfoControllerUtilities");

async function updateLessonReservation(req, res) {
  const
}
