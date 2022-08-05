const db = require('firebase-admin/firestore').getFirestore();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

// Empty for now, will incrementally get populated with extra properties on feature and use cases.
class User {
  static _COLLECTION_NAME = 'users';
  static _SUB_COLLECTION_CLASSES = [];

  constructor(id = null) {
    this.id = id || new mongoose.Types.ObjectId().toString();
  }

  static fromFirestore(snapshot) {
    if (!snapshot.exists) return null;
    return new User(snapshot.id);
  }

  toFirestore() {
    return {
      id: this.id,
    };
  }

  static getCollectionRef() {
    return db.collection(this._COLLECTION_NAME);
  }
  getDocumentRef() {
    return User.getCollectionRef().doc(this.id);
  }

  generateAuthToken(userID = null) {
    return jwt.sign({ userID: userID || this.id }, config.jwt.privateKey, {
      algorithm: config.jwt.algorithm,
    });
  }
}

module.exports.User = User;
