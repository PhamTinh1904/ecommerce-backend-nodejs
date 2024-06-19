"use strict";
const { createLogger, format, transports } = require("winston");
const winston = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, json, align, printf } = winston.format;
const {v4: uuidv4} = require('uuid')

class MyLogger {
  constructor() {
    const formatPrint = printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::[${level}]::${context}::${requestId}::${message}::${
          metadata ? JSON.stringify(metadata) : ""
        }`;
      }
    );

    this.logger = createLogger({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m", // dung lượng file log
          maxFiles: "14d",
          format: combine(
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "info",
        }),
        new winston.transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m", // dung lượng file log
          maxFiles: "14d",
          format: combine(
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "error",
        }),
      ],
    });
    // winston.createLogger({
    //   dirname: "src/logs",
    //   level: "info",
    //   format: winston.format.json(),
    //   defaultMeta: { service: "user-service" }, 
    //   transports: [
    //     //
    //     // - Write all logs with importance level of `error` or less to `error.log`
    //     // - Write all logs with importance level of `info` or less to `combined.log`
    //     //
    //     new winston.transports.File({ filename: "error.log", level: "error" }),
    //     new winston.transports.File({ filename: "combined.log" }),
    //   ],
    // });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();

    return {
      context,
      requestId,
      metadata,
    };
  }

  log(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    this.logger.error(logObject);
  }
}
module.exports = new MyLogger();
