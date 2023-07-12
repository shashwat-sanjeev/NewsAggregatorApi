const express = require("express");
const newsRoutes = express.Router();
const bodyParser = require("body-parser");
const NewsController = require("../Controllers/NewsController");
const {
  authMiddleware,
} = require("../ApplicationServiceProviders/Middlewares");

newsRoutes.use(bodyParser.urlencoded({ extended: true }));
newsRoutes.use(bodyParser.json());

newsRoutes.get("/", authMiddleware, NewsController.getNews);
newsRoutes.get(
  "/search/:keyword",
  authMiddleware,
  NewsController.getNewsByKeyword
);

module.exports = newsRoutes;
