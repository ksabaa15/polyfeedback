const request = require('supertest');
const { app } = require('../../../../src/index');
const { Review } = require('../../../../src/models/review');
const { Course } = require('../../../../src/models/course');
const { User } = require('../../../../src/models/user');
const config = require('config');
const { deepClearCollection, toHttpResponseBody } = require('./firestoreUtil');
const mongoose = require('mongoose');

describe('Review', () => {
  let courseObj, userObj, reviewObj;
  let authToken;

  beforeEach(async () => {
    await deepClearCollection(Course);
    await deepClearCollection(User);

    courseObj = {
      code: 'MATH-123',
      title: 'Introduction to Mathematics',
      teachers: ['Teacher A', 'Teacher B'],
    };
    courseObj = new Course(courseObj.code, courseObj.title, courseObj.teachers);

    userObj = new User();

    reviewObj = {
      courseId: courseObj.id,
      userId: userObj.id,
      text: 'nec ullamcorper sit amet risus nullam eget felis eget nunc lobortis mattis',
    };
    reviewObj = new Review(
      reviewObj.courseId,
      reviewObj.userId,
      reviewObj.text
    );
    delete reviewObj.userId, delete reviewObj.id, delete reviewObj.date;

    await userObj.getDocumentRef().set(userObj.toFirestore());
    await courseObj.getDocumentRef().set(courseObj.toFirestore());

    authToken = userObj.generateAuthToken();
  });

  it('should add only the given input', async () => {
    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    const reviews = (await reviewObj.getCollectionRef().get()).docs;

    expect(response.body).toMatchObject(reviewObj);
    expect(reviews.length).toBe(1);
    expect(toHttpResponseBody(Review, reviews.pop())).toMatchObject(
      response.body
    );
  });

  it('should append review to course', async () => {
    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    const reviews = (
      await courseObj.getDocumentRef().collection('reviews').get()
    ).docs;

    expect(reviews.length).toBeGreaterThan(0);
    expect(toHttpResponseBody(Review, reviews.pop()).id).toBe(response.body.id);
  });

  it('should return status 400 because user Id is not a proper ObjectID', async () => {
    authToken = userObj.generateAuthToken('1234');

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    expect(response.status).toBe(400);
  });

  it('should return status 400 because review should not have a property `userId` ', async () => {
    reviewObj.userId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    expect(response.status).toBe(400);
    expect(response.text).toContain('"userId" is not allowed');
  });

  it('should not append to reviews because user do not exist', async () => {
    const nonExistingUserId = new mongoose.Types.ObjectId().toString();
    authToken = userObj.generateAuthToken(nonExistingUserId);

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    const foundReviews = (await reviewObj.getCollectionRef().get()).docs;

    expect(response.status).toBe(400);
    expect(foundReviews.length).toBe(0);
  });

  it('should not append to reviews because course do not exist', async () => {
    const nonExistingCourseId = new mongoose.Types.ObjectId();
    reviewObj.courseId = nonExistingCourseId;

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    expect(response.status).toBe(400);
    expect(response.text).toContain('Course id does not exist');
  });
});
