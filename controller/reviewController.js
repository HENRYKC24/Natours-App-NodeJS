const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate('user').populate('tour');

  res.status(200).json({
    status: 'success',
    dataCount: reviews.length,
    data: {
      reviews,
    },
  });
});
