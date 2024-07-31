const { logger } = require("../../utilities/mailer");

const { Tag } = require("../../models").sequelize.models;

async function createTag(req, res) {
  const categories = process.env.TAG_CATEGORIES;
  const { category, value } = req.body;

  if (!categories.includes(category)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category" });
  }

  try {
    await Tag.create({ category, value });
    res
      .status(201)
      .json({ success: true, message: "Tag created successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = createTag;
