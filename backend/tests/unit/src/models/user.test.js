require('../../../../src'); // Database initialisation
const { User } = require('../../../../src/models/user');

describe('User', () => {
  const userObj = new User();

  it('should transform a user to its stored firestore format and back to match origin object', async () => {
    const firestoreSnapshot = {
      exists: true,
      id: userObj.toFirestore().id,
      data: () => userObj.toFirestore(),
    };
    const result = User.fromFirestore(firestoreSnapshot);
    expect(result).toMatchObject(userObj);
  });
});
