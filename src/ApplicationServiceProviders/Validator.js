const Joi = require("joi");
const userDB = require("../users.json");

const validEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validPasswordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

class Validator {
  constructor() {}

  static registrationSchema() {
    return Joi.object().keys({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email()
        .required()
        .custom((value, helper) => {
          let unique = userDB.users.findIndex((v) => v.email === value);
          if (unique >= 0) {
            return helper.message({ custom: "Email is already in use" });
          }
          return value;
        }),
      password: Validator.passwordSchema(),
    });
  }

  static loginSchema() {
    return Joi.object().keys({
      email: Joi.string().email().required(),
      password: Validator.passwordSchema(),
    });
  }

  static passwordSchema() {
    return Joi.string()
      .required()
      .min(6)
      .max(16)
      .regex(validPasswordRegex)
      .label("Password")
      .messages({
        "string.pattern.base":
          "Password must have a capital letter, a number and a special charachter",
      });
  }
}

module.exports = Validator;
