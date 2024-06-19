require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { checkOverLoad } = require("./src/helpers/check.connect.js");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const myLogger = require("./src/loggers/mylogger.log");

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

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.log(`input prams :: ${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method == "POST" ? req.body : req.query,
  ]);
  next();
});
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
  const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`;

  myLogger.error(resMessage, [
    req.path,
    {requestId: req.requestId},
    {
      message: error.message
    }
  ])

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    // stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
