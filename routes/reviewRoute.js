const express = require('express');

const router = express.Router();

const { getReviews } = require('../controller/reviewController');

router.route('reviews').get(getReviews);

module.exports = router;
