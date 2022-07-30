const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
  sciper: {
    type: Number,
    required: true,
    unique: true,
  },
});

function validate(review) {
  const joiSchema = Joi.object({
    sciper: Joi.number().required(),
  });
  return joiSchema.validate(review);
}

module.exports.User = mongoose.model('User', schema);
module.exports.validate = validate;
