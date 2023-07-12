const path = require("path");
const fs = require("fs");
const newsData = require("../news.json") || [];

const getNews = (req, res) => {
  const { user } = req;

  return res.status(200).send(user);
};

const getNewsByKeyword = (req, res) => {};

const NewsController = {
  getNews,
  getNewsByKeyword,
};

module.exports = NewsController;
