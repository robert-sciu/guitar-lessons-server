const express = require("express");
const router = express.Router();

const db = require("../models");

router.route("/").post(async (req, res) => {
  await db.sequelize.sync({ force: true });
  console.log("database reset");
  res.json({ message: "success" });
});

module.exports = router;
