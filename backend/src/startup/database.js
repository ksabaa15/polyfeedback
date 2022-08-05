const app = require('firebase-admin/app');
const config = require('config');
const path = require('path');

module.exports = function () {
  let firebaseCredentialPath = config.firebase.credential;
  if (!path.isAbsolute(firebaseCredentialPath))
    firebaseCredentialPath = path.join(
      __dirname,
      '../../',
      firebaseCredentialPath
    );

  const serviceAccount = require(firebaseCredentialPath);
  app.initializeApp({
    credential: app.cert(serviceAccount),
  });
};
