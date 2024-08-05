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
 * Removes empty values from an object.
 *
 * @param {Object} data - The object to remove empty values from.
 * @return {Object} A new object with empty values removed.
 * @example
 * // Example usage:
 * const data = {
 *   name: 'Alice',
 *   age: undefined,
 *   email: 'alice@example.com',
 * };
 * const result = removeEmptyValues(data);
 * // result will be: { name: 'Alice', email: 'alice@example.com' }
 */
function removeEmptyValues(updateData) {
  const newUpdateData = Object.entries(updateData).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  return newUpdateData;
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
    if (data[key]) {
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
  // console.log(model, updateData, id);
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
  if (transaction) {
    return await model.create(data, { transaction: transaction });
  }
  return await model.create(data);
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
    if (Object.keys(id).length > 1) {
      return await model.findOne({
        where: { ...id },
        transaction: transaction,
      });
    }
    return await model.findOne({ where: { id }, transaction: transaction });
  }
  if (Object.keys(id).length > 1) {
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
    return await model.findAll({ where: { id } });
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

module.exports = {
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
  removeEmptyValues,
  destructureData,
};
