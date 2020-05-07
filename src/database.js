const mongoose = require("mongoose");

const URI = "mongodb://192.168.1.150:27017/weintech";

mongoose
  .connect(URI)
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.log(err));

module.exports = mongoose;
