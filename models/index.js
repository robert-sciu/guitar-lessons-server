const fs = require("fs");
const path = require("path");
const config = require("../config/config")[process.env.NODE_ENV]["postgres"];
const basename = path.basename(__filename);
const { Sequelize, DataTypes } = require("sequelize");

const db = {};

const sequelize = new Sequelize(config.options);

fs.readdirSync(__dirname)
  .filter((file) => {
    return file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
