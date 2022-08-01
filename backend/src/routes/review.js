const router = require('express').Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const jwt = require('jsonwebtoken');
const config = require('config');

const { Review, validate } = require('../models/review');
const { Course } = require('../../src/models/course');
const { User } = require('../../src/models/user');

router.post('/', async (req, res) => {
  let review = req.body;

  const { error } = validate(review);
  if (error) return res.status(400).send(error.message);

  if (!(await foundDocument(review.course, Course)))
    return res.status(400).send('Course id does not exist');

  const token = req.header(config.jwt.headerKey);
  const decoded = jwt.decode(token, { complete: true });
  review.user = decoded.payload.userID;
  // TODO to be removed: user must exist because it will be already tested in authentication middleware
  if (!(await foundDocument(review.user, User)))
    return res.status(400).send('User id does not exist');

  review = new Review(review); // To create property `_id`

  // Two Phase Commit (Transaction)
  try {
    await Fawn.Task()
      .save('reviews', review)
      .update(
        'courses',
        { _id: review.course },
        { $addToSet: { reviews: review._id } }
      )
      .run({ useMongoose: true });
    return res.send(review);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

async function foundDocument(documentId, Model) {
  if (!mongoose.Types.ObjectId.isValid(documentId)) return false;
  const result = await Model.findById(documentId);
  return result;
}

module.exports = router;
