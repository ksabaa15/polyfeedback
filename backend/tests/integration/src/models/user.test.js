const config = require('config');
const mongoose = require('mongoose');
const { User, validate } = require('../../../../src/models/user');

describe('User', () => {
  let userObj = {};
  beforeAll(async () => {
    await mongoose.connect(config.database);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    userObj = {
      sciper: 'XXXXXXXXXXXXX',
    };
  });

  it('should add user to database successfully', async () => {
    const user = new User(userObj);
    await expect(user.save()).resolves.toMatchObject(userObj);
    expect(validate(userObj).error).toBeUndefined();
  });
  it('should fail to add user to database because missing required property `sciper` ', async () => {
    delete userObj.sciper;
    const user = new User(userObj);
    await expect(user.save()).rejects.toThrowError(/.*sciper.*/);
    expect(validate(userObj).error).not.toBeUndefined();
  });
  it('should fail to add user to database because wrong type of property `sciper`', async () => {
    userObj.sciper = [];
    const user = new User(userObj);
    await expect(user.save()).rejects.toThrowError(/.*sciper.*/);
    expect(validate(userObj).error).not.toBeUndefined();
  });
});
