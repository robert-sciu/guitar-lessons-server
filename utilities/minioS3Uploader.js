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

async function bulkCheckIfFilesExist(fileObjectsArray) {
  try {
    for (const fileObject of fileObjectsArray) {
      const exists = await checkIfFileExists(
        fileObject.bucketName,
        fileObject.path,
        fileObject.file
      );
      if (!exists) {
        return false;
      }
    }
    return true;
  } catch (error) {
    throw new Error(error);
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
    // Rollback: Delete any files that were uploaded before the error
    await Promise.all(
      uploadedFiles.map(async (file) => {
        try {
          await deleteFileFromS3(file.bucketName, file.path);
        } catch (deleteError) {
          console.error(
            `Failed to delete file during rollback: ${file.path}`,
            deleteError
          );
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
