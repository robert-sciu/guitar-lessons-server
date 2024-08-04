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

function handleErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message: message });
}

function handleSuccessResponse(res, statusCode, response) {
  if (typeof response === "string") {
    return res.status(statusCode).json({ success: true, message: response });
  }
  return res.status(statusCode).json({ success: true, data: response });
}

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

async function createRecord(model, data, transaction) {
  if (transaction) {
    return await model.create(data, { transaction: transaction });
  }
  return await model.create(data);
}

async function findRecordByPk(model, id, transaction) {
  if (transaction) {
    return await model.findByPk(id, { transaction: transaction });
  }
  return await model.findByPk(id);
}
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

async function findRecordByValue(model, value, transaction) {
  if (transaction) {
    return await model.findOne({
      where: { ...value },
      transaction: transaction,
    });
  }
  return await model.findOne({ where: { ...value } });
}

async function findAllRecords(model, id) {
  if (id) {
    return await model.findAll({ where: { id } });
  }
  return await model.findAll();
}

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
};
