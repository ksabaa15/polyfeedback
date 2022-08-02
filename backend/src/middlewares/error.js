const winston = require('winston');
// Custom Error Middleware, to be added at the end of the request processing pipeline
module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).send('Something failed.');
};
