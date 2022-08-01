const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Course code is required.'],
    unique: true,
    minLength: [6, 'Course code too short.'],
    maxLength: [12, 'Course code too long.'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Course title is required.'],
    minLength: [4, 'Course title too short.'],
    maxLength: [148, 'Course title too long'],
    trim: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

module.exports.Course = mongoose.model('Course', schema);
