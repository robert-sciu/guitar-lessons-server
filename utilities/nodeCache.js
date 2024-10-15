const NodeCache = require("node-cache");
const userCache = new NodeCache({ stdTTL: 10 });

module.exports = { userCache };
