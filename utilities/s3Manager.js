const minioS3Uploader = require("./minioS3Uploader");
const awsS3Uploader = require("./awsS3Uploader");

const s3Manager =
  process.env.NODE_ENV === "production" ? awsS3Uploader : awsS3Uploader;

module.exports = s3Manager;
