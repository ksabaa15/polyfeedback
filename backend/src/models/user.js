const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const schema = new mongoose.Schema({
  sciper: {
    type: String, // sciper number salted hash
    required: true,
    unique: true,
  },
});

schema.methods.generateAuthToken = function (userID = null) {
  return jwt.sign({ userID: userID || this._id }, config.jwt.privateKey, {
    algorithm: config.jwt.algorithm,
  });
};

// Will be useful later on, when User Schema evolve (username, picture, etc...)
function validate(review) {
  const joiSchema = Joi.object({
    sciper: Joi.string().required(),
  });
  return joiSchema.validate(review);
}

module.exports.User = mongoose.model('User', schema);
module.exports.validate = validate;
