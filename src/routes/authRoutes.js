const authRoutes = require("express").Router();
const userDB = require("../users.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");

const accessTokenSecret = "myaccesstokensecret";
const writePath = path.join(__dirname, "..", "users.json");

authRoutes.use(bodyParser.urlencoded({ extended: true }));
authRoutes.use(bodyParser.json());

//register
authRoutes.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const message = utils.getMessage(username, email, password);

  if (message.length) {
    res.status(422).send(message);
    return;
  }
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
});

//login
authRoutes.post("/login", (req, res) => {
  const { username, password } = req.body;

  const userIndex = userDB.users.findIndex((u) => {
    return (
      u.username === username && utils.comparePassword(password, u.password)
    );
  });

  if (userIndex >= 0) {
    const user = userDB.users[userIndex];
    // Generate an access token
    const accessToken = jwt.sign(
      { username: user.username, email: user.role, id: user.id },
      accessTokenSecret
    );

    user.token = accessToken;
    let modifiedDB = userDB;
    modifiedDB.users[userIndex] = user;
    fs.writeFile(writePath, JSON.stringify(modifiedDB), (e) => {
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
});

//logout
authRoutes.post("/logout", utils.authenticateJWT, (req, res) => {
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
});
authRoutes.get("/me", utils.authenticateJWT, (req, res) => {
  const { user } = req;
  res.status(200).send(user);
});

module.exports = authRoutes;
