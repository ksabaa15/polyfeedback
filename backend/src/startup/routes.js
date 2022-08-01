const error = require('../middlewares/error');
const express = require('express');
const course = require('../routes/course');
const review = require('../routes/review');
module.exports = function (app) {
  app.use(express.json());
  app.use('/api/courses', course);
  app.use('/api/reviews', review);
  app.use(error);
};
