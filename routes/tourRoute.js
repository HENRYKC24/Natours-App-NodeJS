const express = require('express');
const {
  getAllTours,
  createTour,
  getOneTour,
  updateTour,
  deleteTour,
  top5Cheapest,
  getTourStats,
  getMonthlyPlan,
} = require('../controller/tourController');

const { protect, restrictTo } = require('../controller/authController');

// TOURS ROUTES
const router = express.Router();

// ALIAS ROUTE START
router.route('/top-5-cheapest').get(top5Cheapest, getAllTours);
// ALIAS ROUTE END

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
