const config = require('config');
module.exports = function () {
  if (!config.jwt.privateKey)
    throw new Error(
      'No JWT private key was found, please set the corresponding environment variable and try again.'
    );

  if (!config.database)
    throw new Error('No MongoDB database address was found in configuration');
};
