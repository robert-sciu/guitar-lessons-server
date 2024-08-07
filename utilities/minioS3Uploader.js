const minioClient = require("../config/minioClient");
const logger = require("../utilities/logger");

async function uploadFileToS3(bucketName, path, file) {
  try {
    await minioClient.putObject(
      bucketName,
      `${path}/${file.originalname}`,
      file.buffer,
      {
        "Content-Type": file.mimetype,
        "Encoding-Type": file.encoding,
      }
    );
  } catch (error) {
    logger.error(error);
    throw new Error(`Error uploading file: ${file.originalname}`);
  }
}

async function checkIfFileExists(bucketName, path, file) {
  try {
    await minioClient.statObject(bucketName, `${path}/${file.originalname}`);
    return true;
  } catch (error) {
    if (error.code === "NotFound") {
      return false;
    }
    logger.error(error);
    throw new Error(`Error checking existence of file ${file.originalname}`);
  }
}

async function deleteFileFromS3(bucketName, path) {
  try {
    await minioClient.removeObject(bucketName, path);
  } catch (error) {
    logger.error(error);
    throw new Error(`Error deleting file: ${path}`);
  }
}

async function attachImagePaths(imagesDataArrayJSON, bucketName) {
  try {
    await Promise.all(
      imagesDataArrayJSON.map(async (imageData) => {
        imageData.urlDesktop = await minioClient.presignedGetObject(
          bucketName,
          imageData.filenameDesktop,
          24 * 60 * 60
        );
        imageData.urlMobile = await minioClient.presignedGetObject(
          bucketName,
          imageData?.filenameMobile,
          24 * 60 * 60
        );
        imageData.urlLazy = await minioClient.presignedGetObject(
          bucketName,
          imageData?.filenameLazy,
          24 * 60 * 60
        );
        return imageData;
      })
    );
    return imagesDataArrayJSON;
  } catch (error) {
    logger.error(error);
    throw new Error(`Error attaching image paths`);
  }
}

async function deleteAllFilesFromS3(bucketName, path) {
  try {
    const listObjects = await minioClient.listObjects(bucketName, path);
    await Promise.all(
      listObjects.map(async (object) => {
        try {
          await minioClient.removeObject(bucketName, object.name);
        } catch (error) {
          logger.error(error);
          throw new Error(`Error deleting file: ${object.name}`);
        }
      })
    );
  } catch (error) {
    logger.error(error);
    throw new Error(`Error deleting files`);
  }
}

async function bulkCheckIfFilesExist(fileObjectsArray) {
  try {
    for (const fileObject of fileObjectsArray) {
      const exists = await checkIfFileExists(
        fileObject.bucketName,
        fileObject.path,
        fileObject.file
      );
      if (exists) {
        return true;
      }
    }
    return false;
  } catch (error) {
    logger.error(error);
    throw new Error(`Error checking existence of files`);
  }
}

async function bulkUploadFiles(fileObjectsArray) {
  const uploadedFiles = [];
  try {
    for (const fileObject of fileObjectsArray) {
      await uploadFileToS3(
        fileObject.bucketName,
        fileObject.path,
        fileObject.file
      );
      uploadedFiles.push({
        bucketName: fileObject.bucketName,
        path: `${fileObject.path}/${fileObject.file.originalname}`,
      });
    }
  } catch (error) {
    logger.error(error);
    // Rollback: Delete any files that were uploaded before the error
    await Promise.all(
      uploadedFiles.map(async (file) => {
        try {
          await deleteFileFromS3(file.bucketName, file.path);
        } catch (error) {
          logger.error(error);
          console.error(`Failed to delete file during rollback: ${file.path}`);
        }
      })
    );

    throw new Error(
      `Error uploading files, rolled back successfully uploaded files: ${error.message}`
    );
  }
}

module.exports = {
  uploadFileToS3,
  checkIfFileExists,
  deleteFileFromS3,
  attachImagePaths,
  deleteAllFilesFromS3,
  bulkCheckIfFilesExist,
  bulkUploadFiles,
};
