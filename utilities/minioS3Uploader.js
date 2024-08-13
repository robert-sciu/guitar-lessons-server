const minioClient = require("../config/minioClient");
const logger = require("../utilities/logger");

async function uploadFileToS3(bucketName, path, file) {
  const filePath = `${path}/${file.originalname}`;
  try {
    await minioClient.putObject(bucketName, filePath, file.buffer, {
      "Content-Type": file.mimetype,
      "Encoding-Type": file.encoding,
    });
    if (!(await checkIfFileExists(bucketName, filePath))) {
      throw new Error(`Error uploading file: ${file.originalname}`);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(`Error uploading file: ${file.originalname}`);
  }
}

async function checkIfFileExists(bucketName, filePath) {
  try {
    await minioClient.statObject(bucketName, filePath);
    return true;
  } catch (error) {
    if (error.code === "NotFound") {
      return false;
    }
    logger.error(error);
    throw new Error(`Error checking existence of file : ${filePath}`);
  }
}

async function deleteFileFromS3(bucketName, filePath) {
  try {
    await minioClient.removeObject(bucketName, filePath);
    if (await checkIfFileExists(bucketName, filePath)) {
      throw new Error(`Error deleting file: ${filePath}`);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(`Error deleting file: ${filePath}`);
  }
}

async function attachImageURLs(pageImages, bucketName) {
  const dataArray = pageImages.map((imageData) =>
    imageData.get({ plain: true })
  );

  try {
    const updatedArray = await Promise.all(
      dataArray.map(async (imageData) => {
        imageData.url_desktop = await minioClient.presignedGetObject(
          bucketName,
          imageData.filename_desktop,
          24 * 60 * 60
        );
        imageData.url_mobile = await minioClient.presignedGetObject(
          bucketName,
          imageData?.filename_mobile,
          24 * 60 * 60
        );
        imageData.url_lazy = await minioClient.presignedGetObject(
          bucketName,
          imageData?.filename_lazy,
          24 * 60 * 60
        );
        return imageData;
      })
    );
    return updatedArray;
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
      const path = `${fileObject.path}/${fileObject.file.originalname}`;
      const exists = await checkIfFileExists(fileObject.bucketName, path);
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

/**
 * Uploads multiple files to S3 in a bulk manner. If any error occurs during the upload process,
 * it rolls back by deleting any successfully uploaded files.
 *
 * @param {Array<Object>} fileObjectsArray - An array of objects containing the necessary information
 *                                            to upload each file. Each object should have the following properties:
 *                                            - bucketName: The name of the S3 bucket to upload the file to.
 *                                            - path: The path within the bucket to upload the file to.
 *                                            - file: The file object to upload.
 * @return {Promise<void>} - A promise that resolves when all files have been successfully uploaded, or rejects
 *                           with an error if any error occurs during the upload process.
 * @throws {Error} - If any error occurs during the upload process, including during the rollback process.
 */
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
  attachImageURLs,
  deleteAllFilesFromS3,
  bulkCheckIfFilesExist,
  bulkUploadFiles,
};
