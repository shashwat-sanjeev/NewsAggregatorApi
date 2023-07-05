const authRoutes = require("express").Router();
const userDB = require("../users.json");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");

const statusValues = ["pending", "in-progress", "completed"];
const writePath = path.join(__dirname, "..", "users.json");

authRoutes.use(bodyParser.urlencoded({ extended: true }));
authRoutes.use(bodyParser.json());

//register
authRoutes.post("/register", (req, res) => {
  const { name, email } = req.body;
  const message = utils.getMessage(name, email);

  if (message.length) {
    res.status(422).send(message);
    return;
  }
  let users = userDB.users;
  let id;
  if (users.length) {
    let [{ id: lastId }] = tasks.slice(-1);
    id = ++lastId;
  } else id = 1;
  newUser = {
    id,
    name,
    email,
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

module.exports = authRoutes;
