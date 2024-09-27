const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  endpoint: "http://localhost:4569", // S3rver endpoint
  region: "us-east-1",
  forcePathStyle: true,
  accessKeyId: "accessKey1", // Setting the access key ID
  secretAccessKey: "verySecretKey1", // Setting the secret access key
});

const logger = require("../utilities/logger");

async function uploadFileToS3(bucketName, path, file) {
  const filePath = `${path}/${file.originalname}`;
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    if (!(await checkIfFileExists(bucketName, filePath))) {
      throw new Error(`Error uploading file: ${file.originalname}`);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(`Error uploading file: ${file.originalname}`);
  }
}

// Check if a file exists in S3
async function checkIfFileExists(bucketName, filePath) {
  try {
    const headParams = {
      Bucket: bucketName,
      Key: filePath,
    };
    await s3Client.send(new HeadObjectCommand(headParams));
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    }
    logger.error(error);
    throw new Error(`Error checking existence of file: ${filePath}`);
  }
}

async function deleteFileFromS3(bucketName, filePath) {
  try {
    const params = {
      Bucket: bucketName,
      Key: filePath,
    };

    await s3Client.send(new DeleteObjectCommand(params));

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
        imageData.url_desktop = await s3Client.getSignedUrl("getObject", {
          Bucket: bucketName,
          Key: imageData.filename_desktop,
          Expires: 24 * 60 * 60, // 1 day
        });
        imageData.url_mobile = await s3Client.getSignedUrl("getObject", {
          Bucket: bucketName,
          Key: imageData?.filename_mobile,
          Expires: 24 * 60 * 60,
        });
        imageData.url_lazy = await s3Client.getSignedUrl("getObject", {
          Bucket: bucketName,
          Key: imageData?.filename_lazy,
          Expires: 24 * 60 * 60,
        });
        return imageData;
      })
    );
    return updatedArray;
  } catch (error) {
    logger.error(error);
    throw new Error(`Error attaching image URLs`);
  }
}

async function deleteAllFilesFromS3(bucketName, path) {
  try {
    const listParams = {
      Bucket: bucketName,
      Prefix: path,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: bucketName,
      Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    };

    await s3Client.send(new DeleteObjectsCommand(deleteParams));
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
