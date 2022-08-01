const express = require('express');
const config = require('config');
const course = require('./routes/course');
const review = require('./routes/review');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

if (!config.jwt.privateKey) {
  console.error('Fatal error, JWT private key is not set.');
  process.exit(1);
}

if (!config.database) {
  console.error('Fatal error, database address is not set.');
  process.exit(1);
}

const app = express();

mongoose
  .connect(config.database)
  .catch((err) => console.error('Failed to connect to mongoDB', err));

/*
Note: if you're running multiple apps connected to the same db (horizontal cloud scaling),
provide a string value for _collection that's unique to each app.
Do this to avoid a situation where one app rolls back the unfinished
transaction(s) of another app.

Fawn.init(db, _collection, options)
 */
Fawn.init(config.database);

// Middlewares
app.use(express.json());

// Routes
app.use('/api/courses', course);
app.use('/api/reviews', review);

const port = process.env.PORT || config.app.port;

// when in test, supertest npm will set app listeners and assign ports dynamically
if (process.env.NODE_ENV !== 'test') module.exports.server = app.listen(port);

module.exports.app = app;
