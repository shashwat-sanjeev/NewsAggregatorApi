const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userDB = require("../users.json");
const utils = require("../utils");

const accessTokenSecret = process.env.SECRET_KEY;
const writePath = path.join(__dirname, "..", "users.json");

const register = (req, res) => {
  const { username, email, password } = req.body;

  let users = userDB.users;
  let id;
  if (users.length) {
    let [{ id: lastId }] = users.slice(-1);
    id = ++lastId;
  } else id = 1;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).send({ message: "Internal server error" });
      return;
    }
    newUser = {
      id,
      username,
      email,
      password: hash,
      preferences: [],
      cached_at: null,
      token: null,
    };
    userDB.users.push(newUser);
    fs.writeFile(writePath, JSON.stringify(userDB), (e) => {
      if (e) {
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.status(200).send({ message: "User Registered", user: newUser });
      }
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const userIndex = userDB.users.findIndex((u) => {
    return u.email === email && utils.comparePassword(password, u.password);
  });

  if (userIndex >= 0) {
    const user = userDB.users[userIndex];
    // Generate an access token
    const accessToken = jwt.sign(
      { username: user.username, email: user.email, id: user.id },
      accessTokenSecret
    );

    user.token = accessToken;
    userDB.users[userIndex] = user;
    fs.writeFile(writePath, JSON.stringify(userDB), (e) => {
      if (e) {
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.status(200).send({
          message: "User LoggedIn Successfully",
          user,
          accessToken,
        });
      }
    });
  } else {
    res.status(422).send("Username or password incorrect");
  }
};

const logout = (req, res) => {
  const { user } = req;
  user.token = null;
  userIndex = userDB.users.findIndex((v) => v.id == user.id);
  userDB.users[userIndex] = user;
  fs.writeFile(writePath, JSON.stringify(userDB), (err) => {
    if (err) {
      res.status(500).send({ message: "Internal server error" });
    } else {
      res.status(200).send({ message: "user logged out successfully" });
    }
  });
};

const AuthContoller = {};
AuthContoller.register = register;
AuthContoller.login = login;
AuthContoller.logout = logout;

module.exports = AuthContoller;
