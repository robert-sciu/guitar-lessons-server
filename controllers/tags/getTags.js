const { Tag } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function getTags(req, res) {
  const id = req.query.id;
  if (id) {
    try {
      const tag = await Tag.findByPk(id);
      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: "Tag not found" });
      }
      return res.status(200).json({ success: true, tag });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
  if (!id) {
    try {
      const tags = await Tag.findAll();
      if (tags.length < 1) {
        return res
          .status(404)
          .json({ success: false, message: "No tags found" });
      }
      return res.status(200).json({ success: true, tags });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = getTags;
