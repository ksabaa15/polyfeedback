const config = require('config');
module.exports = function () {
  if (!config.firebase.credential)
    throw new Error('Fatal: No Firebase credentials was found.');

  if (!config.jwt.privateKey)
    throw new Error('Fatal: No JWT private key was found.');
};
