require('../../../../src'); // Database initialisation
const { Course } = require('../../../../src/models/course');

describe('Course', () => {
  const courseObj = new Course('courseCode', 'courseTitle', ['courseTeacher']);

  it('should transform a course to its stored firestore format and back to match origin object', async () => {
    const firestoreSnapshot = {
      exists: true,
      id: courseObj.toFirestore().id,
      data: () => courseObj.toFirestore(),
    };
    const result = Course.fromFirestore(firestoreSnapshot);
    expect(result).toMatchObject(courseObj);
  });
});
