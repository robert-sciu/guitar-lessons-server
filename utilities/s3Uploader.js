const minioS3Uploader = require("./minioS3Uploader");
const awsS3Uploader = require("./awsS3Uploader");

const s3Uploader =
  process.env.NODE_ENV === "production" ? awsS3Uploader : minioS3Uploader;

module.exports = s3Uploader;
