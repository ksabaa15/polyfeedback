const request = require('supertest');
const { Review } = require('../../../../src/models/review');
const { Course } = require('../../../../src/models/course');
const { User } = require('../../../../src/models/user');
const { app } = require('../../../../src/index');
const mongoose = require('mongoose');
const config = require('config');
const Fawn = require('fawn');

describe('Review', () => {
  let courseObj, userObj, reviewObj;
  let course, user, review, authToken;

  beforeEach(async () => {
    await Review.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});

    courseObj = {
      code: 'PHYS-118',
      title: 'Building physics',
      reviews: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    };

    userObj = {
      sciper: 'XXXXXXX',
    };

    reviewObj = {
      course: new mongoose.Types.ObjectId(),
      text: 'nec ullamcorper sit amet risus nullam eget felis eget nunc lobortis mattis',
    };

    course = await new Course(courseObj).save();
    user = await new User(userObj).save();

    authToken = user.generateAuthToken();
    reviewObj.user = user._id;
    reviewObj.course = course._id;
    review = await new Review(reviewObj).save();
    delete reviewObj.user;
  });

  it('should add only the given input', async () => {
    await Review.deleteMany({});
    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    expect(response.body).toMatchObject(reviewObj);
    const reviews = await Review.find();

    expect(reviews).toHaveLength(1);
    expect(JSON.parse(JSON.stringify(reviews[0]))).toMatchObject(response.body);
  });

  it('should append review to course', async () => {
    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    course = await Course.findById(course._id);
    expect(course.reviews.length).toBeGreaterThan(0);
    expect(String(course.reviews.pop())).toBe(response.body._id);
  });

  it('should return status 400 because userID is not a proper ObjectID', async () => {
    authToken = user.generateAuthToken('1234');

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    expect(response.status).toBe(400);
  });

  it('should return status 400 because review does not have a property `user` ', async () => {
    reviewObj.user = new mongoose.Types.ObjectId();
    authToken = user.generateAuthToken('1234');

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    expect(response.status).toBe(400);
    expect(response.text).toContain('"user" is not allowed');
  });

  it('should not append to reviews because user do not exist', async () => {
    const nonExistingUserId = new mongoose.Types.ObjectId();
    authToken = user.generateAuthToken(nonExistingUserId);

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    const foundReviews = await Review.find({ user: nonExistingUserId });

    expect(response.status).toBe(400);
    expect(foundReviews.length).toBe(0);
  });

  it('should not append to reviews because course do not exist', async () => {
    const nonExistingCourseId = new mongoose.Types.ObjectId();
    reviewObj.course = nonExistingCourseId;

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    const foundReviews = await Review.find({ course: nonExistingCourseId });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Course id does not exist');
    expect(foundReviews.length).toBe(0);
  });

  it('should not append to course because user do not exist', async () => {
    const nonExistingUserId = new mongoose.Types.ObjectId();
    authToken = user.generateAuthToken(nonExistingUserId);

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    const foundCourse = await Course.findById(reviewObj.course);

    expect(response.status).toBe(400);
    expect(response.text).toContain('User id does not exist');
    expect(foundCourse.reviews).not.toContain(review._id);
  });

  it('should not append to course because user ID is not a proper ObjectId', async () => {
    const nonExistingUserId = '123';
    authToken = user.generateAuthToken(nonExistingUserId);

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    const foundCourse = await Course.findById(reviewObj.course);

    expect(response.status).toBe(400);
    expect(response.text).toContain('User id does not exist');
    expect(foundCourse.reviews).not.toContain(review._id);
  });

  it('should fail with status 500 because Fawn task failed', async () => {
    const fawnTask = Fawn.Task;
    //Fawn Task Mockup that fails
    Fawn.Task = jest.fn(() => {
      const task = fawnTask();
      task.run = function () {
        return Promise.reject(new Error('Unexpected system error'));
      };
      return task;
    });

    const response = await request(app)
      .post('/api/reviews')
      .set({ [config.jwt.headerKey]: authToken })
      .send(reviewObj);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Unexpected system error');
  });
});
