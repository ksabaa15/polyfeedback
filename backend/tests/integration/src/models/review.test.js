const config = require('config');
const mongoose = require('mongoose');
const { Review, validate } = require('../../../../src/models/review');

describe('Review', () => {
  let reviewObj = {};
  beforeAll(async () => {
    await mongoose.connect(config.database);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Review.deleteMany({});
    reviewObj = {
      course: mongoose.Types.ObjectId(),
      user: mongoose.Types.ObjectId(),
      text: 'neque egestas congue quisque egestas diam in arcu cursus euismod',
    };
  });

  it('should add review to database successfully', async () => {
    const review = new Review(reviewObj);
    await expect(review.save()).resolves.toMatchObject(reviewObj);
    expect(validate(reviewObj).error).toBeUndefined();
  });
  it('should fail to add review to database because missing required property `course` ', async () => {
    delete reviewObj.course;
    const review = new Review(reviewObj);
    await expect(review.save()).rejects.toThrowError(/.*course.*/);
    expect(validate(reviewObj).error).not.toBeUndefined();
  });
  it('should fail to add review to database because missing required property `user` ', async () => {
    delete reviewObj.user;
    const review = new Review(reviewObj);
    await expect(review.save()).rejects.toThrowError(/.*user.*/);
    expect(validate(reviewObj).error).not.toBeUndefined();
  });
  it('should fail to add review to database because missing required property `text` ', async () => {
    delete reviewObj.text;
    const review = new Review(reviewObj);
    await expect(review.save()).rejects.toThrowError(/.*text.*/);
    expect(validate(reviewObj).error).not.toBeUndefined();
  });

  it('should fail to add review to database because wrong type of property `course`', async () => {
    reviewObj.course = 123;
    const review = new Review(reviewObj);
    await expect(review.save()).rejects.toThrowError(/.*course.*/);
    expect(validate(reviewObj).error).not.toBeUndefined();
  });
  it('should fail to add review to database because wrong type of property `user`', async () => {
    reviewObj.user = 123;
    const review = new Review(reviewObj);
    await expect(review.save()).rejects.toThrowError(/.*user.*/);
    expect(validate(reviewObj).error).not.toBeUndefined();
  });
  it('should fail to add review to database because wrong type of property `text`', async () => {
    reviewObj.text = 123;
    const review = new Review(reviewObj);
    await expect(review.save()).rejects.toThrowError(/.*text.*/);
    expect(validate(reviewObj).error).not.toBeUndefined();
  });
});
