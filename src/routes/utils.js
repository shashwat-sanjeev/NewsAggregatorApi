const usersDB = require("../users.json");

const getMessage = (name, email) => {
  let message = [];
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  let unique = usersDB.users.findIndex((v) => v.email === email);
  console.log({ unique });
  if (!name || !name.length) {
    message.push({ Name: "Name can't be empty string" });
  }

  if (!email) {
    message.push({ Email: "Email is required" });
  } else if (!email.match(validRegex)) {
    message.push({ Email: "Email is invalid" });
  } else if (unique >= 0) {
    message.push({ Email: "Email is already in use" });
  }
  return message;
};

const utils = {};
utils.getMessage = getMessage;

module.exports = utils;
