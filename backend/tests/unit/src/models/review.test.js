require('../../../../src'); // Database initialisation
const { Course } = require('../../../../src/models/course');
const { User } = require('../../../../src/models/user');
const { Review } = require('../../../../src/models/review');

describe('Review', () => {
  const reviewObj = new Review('courseID', 'userId', 'reviewText');

  it('should transform a review to its stored firestore format and back to match origin object', async () => {
    const firestoreSnapshot = {
      exists: true,
      id: reviewObj.toFirestore().id,
      data: () => reviewObj.toFirestore(),
    };
    const result = Review.fromFirestore(firestoreSnapshot);
    expect(result).toMatchObject(reviewObj);
  });
});
