const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

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

function validate(review) {
  const joiSchema = Joi.object({
    code: Joi.string().required().min(6).max(12),
    title: Joi.string().required().min(4).max(148),
    reviews: Joi.array().items(Joi.objectId())
  });
  return joiSchema.validate(review);
}

module.exports.Course = mongoose.model('Course', schema);
module.exports.validate = validate;
