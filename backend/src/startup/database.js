const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');
const Fawn = require('fawn');

module.exports = function () {
  mongoose
    .connect(config.database)
    .then(() => winston.info(`Connected to MongoDB...`));

  /**
   *     Note: if you're running multiple apps connected to the same db (e.g. horizontal cloud scaling),
   *     provide a string value for _collection that's unique to each app.
   *     Do this to avoid a situation where one app rolls back the unfinished
   *     transaction(s) of another app.
   *
   *     Fawn.init(db, _collection, options)
   */
  Fawn.init(config.database);
};
