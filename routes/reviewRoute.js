const express = require('express');
const { getReviews, createReview } = require('../controller/reviewController');
const { restrictTo, protect } = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(protect, restrictTo('user'), getReviews)
  .post(createReview);

module.exports = router;
