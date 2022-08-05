const db = require('firebase-admin/firestore').getFirestore();
const { Review } = require('../../src/models/review');

class Course {
  static _COLLECTION_NAME = 'courses';
  static _SUB_COLLECTION_CLASSES = [Review];

  constructor(code, title, teachers, id = null) {
    this.id = id || code;
    this.code = code;
    this.title = title;
    this.teachers = teachers;
  }

  static fromFirestore(snapshot) {
    if (!snapshot.exists) return null;
    const data = snapshot.data();
    return new Course(data.code, data.title, data.teachers, snapshot.id);
  }

  toFirestore() {
    return {
      id: this.id,
      code: this.code,
      title: this.title,
      teachers: this.teachers,
    };
  }

  static getCollectionRef() {
    return db.collection(this._COLLECTION_NAME);
  }

  getDocumentRef() {
    return Course.getCollectionRef().doc(this.id);
  }
}

module.exports.Course = Course;
