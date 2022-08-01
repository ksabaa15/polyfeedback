const config = require('config');
const mongoose = require('mongoose');
const { Course} = require('../../../../src/models/course');

describe('Course', () => {
  let courseObj = {};
  beforeAll(async () => {
    await mongoose.connect(config.database);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Course.deleteMany({});
    courseObj = {
      code: 'PHYS-118',
      title: 'Building physics',
      reviews: [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()],
    };
  });

  it('should add course to database successfully', async () => {
    const course = new Course(courseObj);
    await expect(course.save()).resolves.toMatchObject(courseObj);
  });
  it('should fail to add course to database because missing required property `code` ', async () => {
    delete courseObj.code;
    const course = new Course(courseObj);
    await expect(course.save()).rejects.toThrowError(/.*code.*/);
  });
  it('should fail to add course to database because missing required property `title` ', async () => {
    delete courseObj.title;
    const course = new Course(courseObj);
    await expect(course.save()).rejects.toThrowError(/.*title.*/);
  });
  it('should successfully add course to database and replace missing property `reviews` with an empty array ', async () => {
    delete courseObj.reviews;
    const course = new Course(courseObj);
    courseObj.reviews = [];
    await expect(course.save()).resolves.toMatchObject(courseObj);
  });

  it('should fail to add course to database because wrong type of property `code`', async () => {
    courseObj.code = 123;
    const course = new Course(courseObj);
    await expect(course.save()).rejects.toThrowError(/.*code.*/);
  });
  it('should fail to add course to database because wrong type of property `title`', async () => {
    courseObj.title = 123;
    const course = new Course(courseObj);
    await expect(course.save()).rejects.toThrowError(/.*title.*/);
  });
  it('should successfully add course to database because wrong type of property `reviews`', async () => {
    courseObj.reviews = [123];
    console.log(courseObj);
    const course = new Course(courseObj);
    courseObj.reviews = [];
    await expect(course.save()).rejects.toThrowError(/.*reviews.*/);
  });
});
