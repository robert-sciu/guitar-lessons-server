const { logger } = require("../../utilities/mailer");

const { Tag } = require("../../models").sequelize.models;

async function deleteTag(req, res) {
  const id = req.query.id;
  const tag = await Tag.findByPk(id);

  if (!tag) {
    return res.status(404).json({ success: false, message: "Tag not found" });
  }
  try {
    await tag.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Tag deleted successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = deleteTag;
