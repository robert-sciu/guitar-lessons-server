const multer = require("multer");
const logger = require("../utilities/logger");
const storage = multer.memoryStorage();

const upload = multer({ storage });

function uploadFile(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        logger.error(err.message);
        return handleErrorResponse(res, 400, err.message);
      } else if (err) {
        return handleErrorResponse(res, 400, err.message);
      }
    }
    next();
  });
}

module.exports = uploadFile;
