const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
var cors = require("cors");
require("dotenv").config();

const formData = require("express-form-data");

const { mongoose } = require("./database");

/*
var whitelist = ["http://localhost:3000", "*"];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});



var allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },

    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],

    credentials: true,
  })
);
/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
*/

if (process.env.ON_HEROKU !== "TRUE") {
  var allowedOrigins = [
    "http://localhost:3000",
    "192.168.1.135:*",
    "http://localhost:3002",
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },

      exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],

      credentials: true,
    })
  );
}

if (process.env.ON_HEROKU === "TRUE") {
  /*
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );

    next();
  });
  */
  app.use(cors());
}

const options = {
  uploadDir: "./src/static/uploads",
  autoClean: false,
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream
app.use(formData.stream());
// union the body and the files
app.use(formData.union());

//Settings
app.set("port", process.env.PORT || 3002);
//Middleware
app.use(morgan("dev"));
app.use(express.json());

//Routes

app.use("/api/candidato", require("./routes/candidato.routes"));
app.use("/api/oferta", require("./routes/oferta.routes"));
app.use("/api/empresa", require("./routes/empresa.routes"));

app.use("/api", require("./routes/auth.routes"));

//Static files
app.use("/", express.static(path.join(__dirname, "static")));

app.use("/uploads/", express.static(path.join(__dirname, "static", "uploads")));

//Starting server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
