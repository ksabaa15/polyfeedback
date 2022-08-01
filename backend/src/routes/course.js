const mongoose = require('mongoose');
const router = require('express').Router();
const { Course } = require('../models/course');

router.get('/', async (_req, res) => {
  const courses = await Course.find();
  return res.send(courses);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid Id');
  const course = await Course.find({ _id: req.params.id }).populate('reviews');
  res.send(course);
});

module.exports = router;
