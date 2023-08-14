const express = require("express");
const mazes = require("./routers/mazes.js");
const app = express();
const connectMongo = require("./db/mongo.js");
require("dotenv").config();

const port = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(express.static("./public"));
app.use("/api/v1/mazes", mazes);

const start = async () => {
  try {
    await connectMongo(process.env.mongoURI);
  } catch (error) {
    console.log(error);
  }
};

start().then(() => {
  app.listen(process.env.PORT, console.log("Server is running."));
});
