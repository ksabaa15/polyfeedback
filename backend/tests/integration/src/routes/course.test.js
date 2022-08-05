const request = require('supertest');
const { app } = require('../../../../src/index');
const { Course } = require('../../../../src/models/course');
const { deepClearCollection } = require('./firestoreUtil');

describe('Course', () => {
  let courseObj = {
    code: 'MATH-123',
    title: 'Introduction to Mathematics',
    teachers: ['Teacher A', 'Teacher B'],
  };
  courseObj = new Course(courseObj.code, courseObj.title, courseObj.teachers);
  const courseFirestore = courseObj.toFirestore();

  beforeEach(async () => {
    await deepClearCollection(Course);
  });

  it('should return an empty array of courses', async () => {
    const response = await request(app).get('/api/courses');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it('should return the added course', async () => {
    await Course.getCollectionRef()
      .doc(courseFirestore.id)
      .set(courseFirestore);
    const response = await request(app).get('/api/courses');
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject(courseObj);
  });

  it('should return status 404, invalid course ID', async () => {
    const response = await request(app).get('/api/courses/1234');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Invalid Id');
  });

  it('should return the course with given id', async () => {
    await Course.getCollectionRef()
      .doc(courseFirestore.id)
      .set(courseFirestore);

    const response = await request(app).get(
      `/api/courses/${courseFirestore.id}`
    );
    expect(response.body).toMatchObject(courseObj);
  });
});
