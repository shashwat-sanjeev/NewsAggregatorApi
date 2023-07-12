const userDB = require("./users.json");
const bcrypt = require("bcrypt");

// compare password
async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

const utils = {};
utils.comparePassword = comparePassword;

module.exports = utils;
