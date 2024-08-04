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

async function updateRecord(model, updateData, id) {
  const [updatedRowsCount] = await model.update(updateData, {
    where: {
      id,
    },
  });

  return updatedRowsCount;
}

async function createRecord(model, data) {
  return await model.create(data);
}

async function findRecordByPk(model, id) {
  return await model.findByPk(id);
}
async function findRecordByFk(model, id) {
  return await model.findOne({ where: { id } });
}

async function findRecordByValue(model, value) {
  return await model.findOne({ where: { ...value } });
}

async function findAllRecords(model) {
  return await model.findAll();
}

async function deleteRecord(model, id) {
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
