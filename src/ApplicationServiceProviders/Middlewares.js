const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessTokenSecret = process.env.SECRET_KEY;
const userDB = require("../users.json");

class Middleware {
  constructor() {}

  static validationMiddleware = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error == null) {
        next();
      } else {
        const { details } = error;
        const msg = {};
        details.map(({ path, message }) => {
          const source = path[0];
          msg[source] = message;
        });
        res.status(422).json(msg);
      }
    };
  };

  static authMiddleware = (req, res, next) => {
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
}

module.exports = Middleware;
