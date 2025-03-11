const {
  findRecordByFk,
  destructureData,
  findAllRecords,
  updateRecord,
} = require("../../utilities/controllerUtilites");

const { PlanInfo } = require("../../models").sequelize.models;
const { Op } = require("sequelize");
const config = require("../../config/config")[process.env.NODE_ENV];
const moment = require("moment-timezone");

class PlanInfoService {
  userIsAdmin(user) {
    return user.role === "admin";
  }

  async getPlanInfo(user_id) {
    return await findRecordByFk(PlanInfo, user_id);
  }

  async getAllPlanInfos() {
    return await findAllRecords(PlanInfo);
  }

  async updatePlanInfo(user_id, updateData) {
    return await updateRecord(PlanInfo, updateData, user_id);
  }

  destructurePlanInfoUpdateData(data) {
    return destructureData(data, ["lesson_balance", "discount"]);
  }
}

const planInfoService = new PlanInfoService();

module.exports = planInfoService;
