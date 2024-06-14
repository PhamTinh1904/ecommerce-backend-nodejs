require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { checkOverLoad } = require("./src/helpers/check.connect.js");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init database
const instanceMongodb = require("./src/dbs/init.mongodb.js");
const initElasticsearch = require("./src/dbs/init.elasticsearch.js");
initElasticsearch.init({ ELASTICSEARCH_IS_ENABLED: true });
checkOverLoad();
// init routes
app.use("", require("./src/routes"));
// handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});


module.exports = app;
