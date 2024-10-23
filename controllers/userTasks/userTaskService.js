const {
  deleteRecord,
  findRecordByPk,
  findRecordByFk,
  updateRecord,
  createRecord,
  destructureData,
} = require("../../utilities/controllerUtilites");

const { Task, User, Tag, UserTask } = require("../../models").sequelize.models;

class UserTaskService {
  constructor() {}
  async fetchUserTasks(userId, showCompleted = false) {
    const userTasks = await Task.findAll({
      include: [
        {
          model: User,
          where: { id: userId }, // exclude tasks associated with the user
          required: true, // use LEFT JOIN
          attributes: [],
        },
        {
          model: Tag,
          through: { attributes: [] },
        },
        {
          model: UserTask,
          as: "user_task",
          where: { is_completed: showCompleted ? true : false },
          attributes: ["id", "user_notes"],
        },
      ],
    });
    return userTasks;
  }

  async createUserTask(data) {
    return await createRecord(UserTask, data);
  }
  async findUserTask(user_id, task_id) {
    return await findRecordByFk(UserTask, { user_id, task_id });
  }
  async findTaskById(task_id) {
    return await findRecordByPk(Task, task_id);
  }
  async updateUserTask(task_id, data) {
    return await updateRecord(UserTask, data, task_id);
  }
  async deleteUserTask(taskId) {
    return await deleteRecord(UserTask, taskId);
  }
  destrucureCreateUserTaskData(data) {
    return destructureData(data, ["task_id"]);
  }
  destructureUpdateUserTaskNotesData(data) {
    return destructureData(data, ["task_id", "user_notes"]);
  }
  destructureUpdateUserTaskCompletedData(data) {
    return destructureData(data, ["user_id", "task_id", "is_completed"]);
  }
}

const userTaskService = new UserTaskService();

module.exports = userTaskService;
