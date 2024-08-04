const minioClient = require("../config/minioClient");

async function uploadFileToS3(bucketName, path, file) {
  try {
    // const metadata = { "Content-Type": file.mimetype };
    await minioClient.putObject(
      bucketName,
      path + "/" + file.originalname,
      file.buffer,
      {
        "Content-Type": file.mimetype,
        "Encoding-Type": file.encoding,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function checkIfFileExists(bucketName, path, file) {
  try {
    await minioClient.statObject(bucketName, path + "/" + file.originalname);
    return true;
  } catch (error) {
    if (error.code === "NotFound") {
      return false;
    }
    throw new Error(error);
  }
}

async function deleteFileFromS3(bucketName, path, filename) {
  try {
    await minioClient.removeObject(bucketName, path + "/" + filename);
  } catch (error) {
    throw new Error(error);
  }
}

async function attachImagePaths(paintingsDataArrayJSON, bucketName) {
  try {
    for (const imageData of paintingsDataArrayJSON) {
      imageData.url = await minioClient.presignedGetObject(
        bucketName,
        imageData.fileName,
        24 * 60 * 60
      );
    }
    return paintingsDataArrayJSON;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteAllFilesFromS3(bucketName, path) {
  try {
    const listObjects = await minioClient.listObjects(bucketName, path);
    for (const object of listObjects) {
      await minioClient.removeObject(bucketName, object.name);
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  uploadFileToS3,
  checkIfFileExists,
  deleteFileFromS3,
  attachImagePaths,
};
