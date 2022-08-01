const express = require('express');
const config = require('config');
const winston = require('winston');

const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/validation')();

const port = process.env.PORT || config.app.port;
// when in test, supertest npm will set app listeners and assign ports dynamically
if (process.env.NODE_ENV !== 'test')
  module.exports.server = app.listen(port, () =>
    winston.info(`App listening to port ${port}...`)
  );

module.exports.app = app;
