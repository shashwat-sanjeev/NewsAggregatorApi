const authRoutes = require("express").Router();
const bodyParser = require("body-parser");
const Validator = require("../ApplicationServiceProviders/Validator");
const Middleware = require("../ApplicationServiceProviders/Middlewares");
const AuthContoller = require("../Controllers/AuthController");

authRoutes.use(bodyParser.urlencoded({ extended: true }));
authRoutes.use(bodyParser.json());

//register
authRoutes.post(
  "/register",
  Middleware.validationMiddleware(Validator.registrationSchema()),
  AuthContoller.register
);

//login
authRoutes.post(
  "/login",
  Middleware.validationMiddleware(Validator.loginSchema()),
  AuthContoller.login
);

//logout
authRoutes.post("/logout", Middleware.authMiddleware, AuthContoller.logout);
authRoutes.get("/me", Middleware.authMiddleware, (req, res) => {
  const { user } = req;
  res.status(200).send(user);
});

module.exports = authRoutes;
