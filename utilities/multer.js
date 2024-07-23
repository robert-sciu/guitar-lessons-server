const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

function uploadFile(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}

module.exports = uploadFile;
