module.exports = {
  testMatch: ["**/tests/**/*.(test|spec).[jt]s?(x)"],
  globalSetup: "./tests/helpers/setup.js",
  globalTeardown: "./tests/helpers/teardown.js",
  // setupFilesAfterEnv: ["./tests/helpers/setupTestFramework.js"],
  testEnvironment: "node",
  maxWorkers: 1,
};
