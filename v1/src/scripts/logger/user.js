const winston = require("winston");

const userLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: "v1/src/logs/user/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "v1/src/logs/user/info.log",
      level: "info",
    }),
  ],
});

module.exports = userLogger;
