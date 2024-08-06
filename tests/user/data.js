const createUserData = {
  validStudent: {
    username: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "student",
  },
  validAdmin: {
    username: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  defaultValues: {
    difficulty_clearance_level: this.role === "admin" ? 999 : 0,
    is_confirmed: this.role === "admin" ? true : false,
  },

  invalidNameList: ["", 0, "12", undefined, null, true, false, NaN],
  invalidEmailList: [
    "",
    0,
    "12",
    undefined,
    null,
    "",
    true,
    false,
    NaN,
    "@email.com",
    "user@email.",
  ],

  invalidQueryParameterList: ["", 0, "id", null, true, false, NaN],
  invalidPasswordList: ["", 0, "12sd", undefined, null, "", true, false, NaN],
  invalidRoleList: ["", 0, "12", undefined, null, "", true, false, NaN],
};

const updateUserData = {
  valid: {
    id: 1,
    difficulty_clearance_level: 1,
    is_confirmed: true,
  },

  invalidIdList: ["invalid", 0, "1n", true, false, NaN],

  invalidDifficultyClearanceList: [
    "invalid",
    "clearance",
    null,
    true,
    false,
    true,
    NaN,
  ],

  invalidConfirmedList: ["invalid", "confirmed", null, NaN],
};

const deleteUserData = {
  invalidIdList: ["invalid", 0, "1n", undefined, null, "", true, false, NaN],
};

module.exports = {
  createUserData,
  updateUserData,
  deleteUserData,
};
