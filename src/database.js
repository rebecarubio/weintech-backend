const mongoose = require("mongoose");

const URI =
  process.env.ON_HEROKU === "TRUE"
    ? process.env.DATABASE_STRING
    : "mongodb://192.168.1.150:27017/weintech";

mongoose
  .connect(URI)
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.log(err));

module.exports = mongoose;
