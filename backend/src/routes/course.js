const router = require('express').Router();
const { Course } = require('../models/course');
const { Review } = require('../models/review');

router.get('/', async (_req, res) => {
  const courseCollection = await Course.getCollectionRef().get();
  const courses = courseCollection.docs.map(Course.fromFirestore);
  return res.send(courses);
});

router.get('/:id', async (req, res) => {
  // Get course
  const courseDoc = await Course.getCollectionRef().doc(req.params.id).get();
  const course = Course.fromFirestore(courseDoc);
  if (!course) return res.status(404).send('Invalid Id');

  // Get course reviews
  const reviewCollection = await Course.getCollectionRef()
    .doc(req.params.id)
    .collection('reviews')
    .get();
  course.reviews = reviewCollection.docs.map(Review.fromFirestore);

  res.send(course);
});

module.exports = router;
