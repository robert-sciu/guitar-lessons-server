const { Tag } = require("../../models").sequelize.models;
const logger = require("../../utilities/logger");

async function updateTag(req, res) {
  const id = req.query.id;

  const tag = await Tag.findByPk(id);

  if (!tag) {
    return res.status(404).json({ success: false, message: "Tag not found" });
  }
  const { category } = req.body;
  if (category) {
    if (!process.env.TAG_CATEGORIES.includes(category)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }
  }
  try {
    await tag.update(req.body);
    return res
      .status(200)
      .json({ success: true, message: "Tag updated successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = updateTag;
