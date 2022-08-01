const request = require('supertest');
const { Course } = require('../../../../src/models/course');
const { app } = require('../../../../src/index');
const mongoose = require('mongoose');

describe('Course', () => {
  let courseObj = {
    code: 'PHYS-118',
    title: 'Building physics',
    reviews: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
  };
  beforeEach(async () => {
    await Course.deleteMany({});
  });

  it('should return an empty array of courses', async () => {
    const response = await request(app).get('/api/courses');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it('should return the added course', async () => {
    await Course.create(courseObj);
    const response = await request(app).get('/api/courses');
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject(courseObj);
  });

  it('should return status 404 (invalid objectID)', async () => {
    const response = await request(app).get('/api/courses/1234');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Invalid Id');
  });

  it('should return the course with given id', async () => {
    let course = await Course.create(courseObj);
    course = await course.populate('reviews');

    const response = await request(app).get(`/api/courses/${course._id}`);
    expect(response.body[0]).toMatchObject(JSON.parse(JSON.stringify(course)));
  });
});
