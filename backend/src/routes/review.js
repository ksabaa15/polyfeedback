const router = require('express').Router();
const db = require('firebase-admin/firestore').getFirestore();
const jwt = require('jsonwebtoken');
const config = require('config');
const { Review, validate } = require('../models/review');
const { Course } = require('../models/course');
const { User } = require('../models/user');
const mongoose = require('mongoose');

// No need for an atomic transaction: courses and users do not get deleted for now.
router.post('/', async (req, res) => {
  const reviewInput = req.body;
  const { error } = validate(reviewInput);
  if (error) return res.status(400).send(error.message);

  //TODO: userID should be passed throw the request processing pipeline from the authentication middleware (e.g. req.userId)
  const token = req.header(config.jwt.headerKey);
  const decoded = jwt.decode(token, { complete: true });
  const userID = decoded.payload.userID;

  // TODO to be removed: user id must be valid because it will be already tested in authentication middleware
  if (!mongoose.Types.ObjectId.isValid(userID))
    return res.status(400).send('User Id is not valid.');

  const review = new Review(reviewInput.courseId, userID, reviewInput.text);

  const courseDoc = await Course.getCollectionRef().doc(review.courseId).get();
  if (!courseDoc.exists)
    return res.status(400).send('Course id does not exist');

  // TODO to be removed: user must exist because it will be already tested in authentication middleware
  const userDoc = await User.getCollectionRef().doc(review.userId).get();
  if (!userDoc.exists) return res.status(400).send('User id does not exist');

  await review.getDocumentRef().set(review.toFirestore());

  return res.send(review);
});

module.exports = router;
