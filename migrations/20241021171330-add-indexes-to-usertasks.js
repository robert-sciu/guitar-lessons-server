"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("UserTasks", ["user_id"]);
    await queryInterface.addIndex("UserTasks", ["task_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("UserTasks", ["user_id"]);
    await queryInterface.removeIndex("UserTasks", ["task_id"]);
  },
};
