const mongoose = require('mongoose');
const firestore = require('firebase-admin/firestore');
const Joi = require('joi');
const db = firestore.getFirestore();

class Review {
  static _COLLECTION_NAME = 'reviews';
  static _SUB_COLLECTION_CLASSES = [];

  constructor(courseId, userId, text, date = null, id = null) {
    this.id = id || new mongoose.Types.ObjectId().toString();
    this.date = date || firestore.Timestamp.now().toDate();
    this.courseId = courseId;
    this.userId = userId;
    this.text = text;
  }

  static fromFirestore(snapshot) {
    if (!snapshot.exists) return null;
    const data = snapshot.data();
    return new Review(
      data.courseId,
      data.userId,
      data.text,
      data.time.toDate(),
      snapshot.id
    );
  }

  toFirestore() {
    return {
      id: this.id,
      courseId: this.courseId,
      userId: this.userId,
      text: this.text,
      time: firestore.Timestamp.fromDate(this.date),
    };
  }
  getCollectionRef() {
    return db
      .collection('courses')
      .doc(this.courseId)
      .collection(Review._COLLECTION_NAME);
  }
  getDocumentRef() {
    return this.getCollectionRef().doc(this.id);
  }
}

// Validate User input
// User id comes from request header, it is validated in the authentication middleware
function validate(review) {
  const joiSchema = Joi.object({
    courseId: Joi.string(),
    text: Joi.string().required().min(50).max(1000),
  });
  return joiSchema.validate(review);
}

module.exports.Review = Review;
module.exports.validate = validate;
