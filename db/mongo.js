const mongoose = require("mongoose");

const connectMongo = (url) => {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Mongo!"));
};

module.exports = connectMongo;
