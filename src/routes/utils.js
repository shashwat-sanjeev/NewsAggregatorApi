const userDB = require("../users.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const accessTokenSecret = "myaccesstokensecret";

const getMessage = (name, email, password) => {
  let message = [];
  let validEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  let validPasswordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  let unique = userDB.users.findIndex((v) => v.email === email);

  if (!name || !name.length) {
    message.push({ UserName: "Name can't be empty string" });
  }

  if (!email) {
    message.push({ Email: "Email is required" });
  } else if (!email.match(validEmailRegex)) {
    message.push({ Email: "Email is invalid" });
  } else if (unique >= 0) {
    message.push({ Email: "Email is already in use" });
  }

  if (!password) {
    message.push({ Password: "password can't be empty" });
  } else if (!password.match(validPasswordRegex)) {
    message.push({
      password:
        "password length between 6 and 16, must have atleast one number and special charachter",
    });
  }
  return message;
};

// compare password
async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      let userFromDb = userDB.users.find((v) => v.id == user.id);
      if (userFromDb.hasOwnProperty("token") && userFromDb.token === token) {
        req.user = userFromDb;
        next();
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
};

const utils = {};
utils.getMessage = getMessage;
utils.comparePassword = comparePassword;
utils.authenticateJWT = authenticateJWT;

module.exports = utils;
