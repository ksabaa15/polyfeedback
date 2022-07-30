const config = require('config');
const mongoose = require('mongoose');

describe('MongoDB', () => {
  it('should connect and disconnect successfully from MongoDB', async () => {
    const openConnectionPromise = mongoose.connect(config.database);
    await expect(openConnectionPromise).resolves.not.toBeFalsy();
    const closeConnectionPromise = mongoose.connection.close();
    await expect(closeConnectionPromise).resolves.toBeUndefined();
  });
});
