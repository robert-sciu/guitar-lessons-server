const multer = require("multer");
const logger = require("../utilities/logger");
const storage = multer.memoryStorage();

const upload = multer({ storage });

function uploadFile(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      logger.error(err);
      return res.status(400).json({ message: "File upload failed" });
    }
    next();
  });
}

module.exports = uploadFile;
