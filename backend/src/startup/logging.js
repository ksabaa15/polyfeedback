const winston = require('winston');

/**
 Monkey patches all route handlers at runtime:
 wraps them in try catch blocks and calls the error middleware in case of any potential errors.
 **/
require('express-async-errors');

module.exports = function () {
  const myFormat = winston.format.printf(
    ({ level, timestamp, message, stack }) => {
      return `${level.toUpperCase()} ${timestamp}\n${stack || message || ' '}`;
    }
  );
  const commonOptions = {
    handleExceptions: true,
    handleRejections: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss A ZZ',
      }),
      myFormat
    ),
  };

  winston.add(new winston.transports.Console(commonOptions));
  winston.add(
    new winston.transports.File({
      filename: 'logs/logfile.log',
      level: 'warn',
      ...commonOptions,
    })
  );
};
