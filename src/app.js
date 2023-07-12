const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("express").Router();
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");

const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

routes.get("/", (req, res) => {
  res.status(200).send("Welcome to the News Aggregator Api Manager");
});

routes.use("/", authRoutes);
routes.use("/news", newsRoutes);

app.listen(PORT, (err) => {
  if (!err) {
    console.log("server started successfully");
  } else {
    console.log("some error occurred");
  }
});
