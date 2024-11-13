const fileCompressor = require("./sharpCompressor");
const s3Manager = require("./s3Manager");
const crypto = require("crypto");

/**
 * Checks if all values in the data object are missing (i.e., undefined).
 *
 * @param {Object} data - The object to check for missing values.
 * @return {Boolean} True if all values are missing, false otherwise.
 * @example
 * // Example usage:
 * const data = {
 *   name: undefined,
 *   age: undefined,
 *   email: undefined,
 * };
 * const result = checkMissingValues(data);
 * // result will be: true
 * } 
 *  

 */
function checkMissingUpdateData(updateData) {
  const noValues = Object.values(updateData).filter(
    (value) => value === undefined
  );

  if (noValues.length === Object.values(updateData).length) {
    return true;
  } else {
    return false;
  }
}

/**
 * Destructures specific keys from the given data object.
 *
 * @param {Object} data - The source object containing data.
 * @param {[]} keys - An array of strings representing the keys to be extracted from the data object.
 * @returns {Object} A new object containing only the specified keys and their associated values from the data object.
 *
 * @example
 * // Example usage:
 * const data = {
 *   name: 'Alice',
 *   age: 30,
 *   email: 'alice@example.com',
 * };
 * const keys = ['name', 'email'];
 * const result = destructureData(data, keys);
 * // result will be: { name: 'Alice', email: 'alice@example.com' }
 */
function destructureData(data, keys) {
  const newData = keys.reduce((acc, key) => {
    if (data[key] !== undefined) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
  return newData;
}

/**
 * Sends a JSON error response with the specified status code and message.
 *
 * @param {Object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code to be sent.
 * @param {string} message - The error message or object to include in the response.
 * @returns {Object} The response object from the server.
 */
function handleErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message: message });
}

/**
 * Handles a successful response by sending a JSON object with a success status
 * and either a message or data property based on the type of the response.
 *
 * @param {Object} res - The response object from the server.
 * @param {number} statusCode - The HTTP status code to send in the response.
 * @param {string|Object} response - The response data to send in the response.
 * @return {Object} The response object from the server.
 */
function handleSuccessResponse(res, statusCode, response) {
  if (typeof response === "string") {
    return res.status(statusCode).json({ success: true, message: response });
  }
  return res.status(statusCode).json({ success: true, data: response });
}

/**
 * Updates a record in the database using the provided model, update data, ID, and transaction (optional).
 *
 * @param {Object} model - The model used to interact with the database.
 * @param {Object} updateData - The data used to update the record.
 * @param {number} id - The ID of the record to update.
 * @param {Object} [transaction] - The transaction object (optional).
 * @return {Promise<number>} The number of updated rows.
 */
async function updateRecord(model, updateData, id, transaction) {
  if (transaction) {
    const [updatedRowsCount] = await model.update(updateData, {
      where: {
        id,
      },
      transaction: transaction,
    });
    return updatedRowsCount;
  }
  const [updatedRowsCount] = await model.update(updateData, {
    where: {
      id,
    },
  });
  return updatedRowsCount;
}

/**
 * Creates a record in the database using the provided model, data, and optional transaction.
 *
 * @param {Object} model - The model used to interact with the database.
 * @param {Object} data - The data used to create the record.
 * @param {Object} [transaction] - The transaction object (optional).
 * @return {Promise<Object>} The created record.
 */
async function createRecord(model, data, transaction) {
  try {
    if (transaction) {
      return model.create(data, { transaction: transaction });
    }
    return model.create(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Finds a record by primary key using the provided model and ID.
 *
 * @param {Object} model - The model used to interact with the database.
 * @param {number} id - The primary key of the record to find.
 * @param {Object} [transaction] - The transaction object (optional).
 * @return {Promise<Object>} A promise that resolves to the found record.
 */
async function findRecordByPk(model, id, transaction) {
  if (transaction) {
    return await model.findByPk(id, { transaction: transaction });
  }
  return await model.findByPk(id);
}

/**
 * Finds a record by foreign key using the provided model and ID.
 *
 * @param {Object} model - The model used to interact with the database.
 * @param {Object|number} id - The foreign key of the record to find. It can be an object with multiple keys or a single numeric ID.
 * @param {Object} [transaction] - The transaction object (optional).
 * @return {Promise<Object>} A promise that resolves to the found record.
 */
async function findRecordByFk(model, id, transaction) {
  if (transaction) {
    if (!Number(id) && Object.keys(id).length > 1) {
      return await model.findOne({
        where: { ...id },
        transaction: transaction,
      });
    }
    return await model.findOne({ where: { id }, transaction: transaction });
  }
  if (!Number(id) && Object.keys(id).length > 1) {
    return await model.findOne({ where: { ...id } });
  }
  return await model.findOne({ where: { id } });
}

/**
 * Finds a record from the database using the provided model and value.
 *
 * @param {Object} model - The model used to interact with the database.
 * @param {Object} value - The value used to filter the records.
 * @param {Object} [transaction] - The transaction object (optional).
 * @return {Promise<Object>} A promise that resolves to the found record.
 */
async function findRecordByValue(model, value, transaction) {
  if (transaction) {
    return await model.findOne({
      where: { ...value },
      transaction: transaction,
    });
  }
  return await model.findOne({ where: { ...value } });
}

/**
 * Finds all records from the database using the provided model and parameter.
 *
 * @param {Object} model - The model used to interact with the database.
 * @param {Object} id - The parameter used to filter the records. If provided, it filters the records by the ID.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of records. If the parameter is provided, it filters the records by the ID. If the parameter is not provided, it returns all records.
 */
async function findAllRecords(model, id) {
  if (id) {
    return await model.findAll({ where: { ...id } });
  }
  return await model.findAll();
}

/**
 * Deletes a record from the database based on the provided model, ID, and transaction.
 *
 * @param {Object} model - The model used to interact with the database.
 * @param {number} id - The ID of the record to be deleted.
 * @param {Object} [transaction] - The transaction object (optional).
 * @return {Promise<void>} A promise that resolves when the record is successfully deleted.
 */
async function deleteRecord(model, id, transaction) {
  if (transaction) {
    return await model.destroy({ where: { id }, transaction: transaction });
  }
  return await model.destroy({ where: { id } });
}

/**
 * Generates compressed image objects based on the provided parameters.
 *
 * @param {Object} options - The options object.
 * @param {string} options.bucketName - The name of the bucket.
 * @param {string} options.imgPath - The path of the image.
 * @param {Object} options.inputFile - The input file object.
 * @param {Array<Object>} options.compressionSizes - The array of compression sizes.
 * @param {string} options.compressionSizes[].sizePath - The path of the size.
 * @param {string} options.compressionSizes[].compressionType - The type of compression.
 * @param {string} options.compressionSizes[].filePrefix - The prefix of the file.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of compressed image objects.
 */
async function generateCompressedImageObjects({
  bucketName,
  imgPath,
  inputFile,
  desktopSize,
}) {
  const compressionSizes = createImageSizesConfigObject(desktopSize);
  const objects = await Promise.all(
    Object.values(compressionSizes).map(async (params) => {
      return {
        bucketName,
        path: `${imgPath}/${params.sizePath}`,
        file: await fileCompressor(
          params.compressionType,
          inputFile,
          `${params.filePrefix}-${inputFile.originalname}`
        ),
      };
    })
  );
  return objects;
}

function createImageSizesConfigObject(sizeOnPage) {
  return {
    desktop: {
      compressionType: sizeOnPage,
      sizePath: process.env.DESKTOP_IMG_PATH,
      filePrefix: "desktop",
    },
    mobile: {
      compressionType: "mobile",
      sizePath: process.env.MOBILE_IMG_PATH,
      filePrefix: "mobile",
    },
    lazy: {
      compressionType: "lazy",
      sizePath: process.env.LAZY_IMG_PATH,
      filePrefix: "lazy",
    },
  };
}
function createPathsObjectForAllSizes(data, sizesObject) {
  const sizeTypes = Object.keys(sizesObject);
  const pathsData = {};
  sizeTypes.forEach((size) => {
    pathsData[
      `filename_${size}`
    ] = `${sizesObject[size].filePrefix}-${data.filename}`;
  });
  return pathsData;
}

function addFilePathsToImageData(data, sizeOnPage) {
  // createImageSizesConfigObject returns three objects with compression type, size path and file prefix
  //for desktop, mobile and lazy image sizes
  // compression type is used by sharp, sizePath and filePrefix are used by s3Manager to prepare the file names
  // and put them in respective folders
  // size on page is the only property that can be changed, lazy and mobile image sizes are always the same
  // sizeOnPage is the compression type for desktop image
  const sizes = sizeOnPage
    ? createImageSizesConfigObject(sizeOnPage)
    : createImageSizesConfigObject(data.sizeOnPage);
  // createPathsObjectForAllSizes gets the sizes objects and the file original name and returns
  // data object with three properties: desktop, mobile and lazy, each containing paths to the compressed images
  // it does not compress the original image, it just adds paths based on the compression type and original name.
  const pathsData = createPathsObjectForAllSizes(data, sizes);
  const dataWithPaths = {
    ...data,
    ...pathsData,
  };
  dataWithPaths.sizeOnPage = sizeOnPage ? sizeOnPage : data.sizeOnPage;
  return dataWithPaths;
}

async function deleteAllPageImageFiles(imgObject) {
  const pageImagesBucketEnpoint = process.env.BUCKET_PAGE_IMAGES;
  const bucketName = process.env.BUCKET_NAME;
  const { filename_desktop, filename_mobile, filename_lazy } = imgObject;
  const filenames = [filename_desktop, filename_mobile, filename_lazy];
  try {
    await Promise.all(
      filenames.map(async (filename) => {
        const imgTypeEndpoint = filename.split("-")[0];
        const fullPath = `${pageImagesBucketEnpoint}/${imgTypeEndpoint}/${filename}`;
        await s3Manager.deleteFileFromS3(bucketName, fullPath);
      })
    );
    const existingFiles = [];
    await Promise.all(
      filenames.map(async (filename) => {
        const imgTypeEndpoint = filename.split("-")[0];
        const fullPath = `${pageImagesBucketEnpoint}/${imgTypeEndpoint}/${filename}`;
        const exists = await s3Manager.checkIfFileExists(bucketName, fullPath);
        if (exists) {
          existingFiles.push(filename);
        }
      })
    );
    if (existingFiles.length > 0) {
      throw new Error(`Error deleting files: ${existingFiles.join(", ")}`);
    }
  } catch (error) {
    throw new Error(error);
  }
}

function unchangedDataToUndefined(originalData, updateData) {
  /**
   * Updates the given update data object by setting the values that are the same as the original values to undefined.
   *
   * @param {object} originalData - The original data object.
   * @param {object} updateData - The update data object.
   * @return {object} The updated update data object.
   */
  const updateDataFiltered = {};
  const keys = Object.keys(updateData);
  for (const key of keys) {
    if (originalData[key] === updateData[key]) {
      updateDataFiltered[key] = undefined;
    } else {
      updateDataFiltered[key] = updateData[key];
    }
  }
  return updateDataFiltered;
}

module.exports = {
  addFilePathsToImageData,
  checkMissingUpdateData,
  handleSuccessResponse,
  handleErrorResponse,
  findRecordByPk,
  findRecordByFk,
  findRecordByValue,
  updateRecord,
  createRecord,
  deleteRecord,
  findAllRecords,
  unchangedDataToUndefined,
  destructureData,
  generateCompressedImageObjects,
  createImageSizesConfigObject,
  createPathsObjectForAllSizes,
  deleteAllPageImageFiles,
};
