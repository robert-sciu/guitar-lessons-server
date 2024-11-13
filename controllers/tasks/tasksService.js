const { Op } = require("sequelize");
const { Task, User, Tag } = require("../../models").sequelize.models;

class TasksService {
  constructor() {}
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Fetches tasks with associated tags and users, excluding tasks already
   * associated with the given user. The difficulty level of the tasks is also
   * filtered to be less than or equal to the user's difficulty clearance level
   * and greater than or equal to the user's minimum task level to display.
   *
   * @param {Object} user The user to fetch tasks for
   * @return {Promise<Array<Object>>} A promise resolving to the fetched tasks
   */
  /******  19a95073-b56c-4056-9e3a-14198f6aa7d7  *******/
  async fetchTasks(user) {
    return await Task.findAll({
      include: [
        {
          model: User,
          through: { attributes: [] },
          where: { id: user.id }, // exclude tasks associated with the user
          required: false, // use LEFT JOIN
          attributes: [], // exclude user data
        },
        {
          model: Tag,
          through: { attributes: [] },
        },
      ],
      where: {
        difficulty_level: {
          [Op.lte]: user.difficulty_clearance_level,
          [Op.gte]: user.minimum_task_level_to_display,
        },
        "$Users.id$": null,
      },
    });
  }
}

const tasksService = new TasksService();

module.exports = tasksService;
