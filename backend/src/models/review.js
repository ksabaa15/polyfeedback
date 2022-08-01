const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    minLength: [50, 'Review text is too short.'],
    maxLength: [1000, 'Review text is too long.'],
    trim: true,
  },
});

function validate(review) {
  const joiSchema = Joi.object({
    course: Joi.object(Joi.objectId()).required(),
    user: Joi.object(Joi.objectId()).required(),
    text: Joi.string().required().min(50).max(1000),
  });
  return joiSchema.validate(review);
}

module.exports.Review = mongoose.model('Review', schema);
module.exports.validate = validate;
