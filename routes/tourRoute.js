const express = require('express');
const tourControllers = require('../controller/tourController');

const {
  getAllTours,
  createTour,
  getOneTour,
  updateTour,
  deleteTour,
  top5Cheapest,
  getTourStats,
  getMonthlyPlan,
} = tourControllers;

// TOURS ROUTES
const router = express.Router();

// ALIAS ROUTE START
router.route('/top-5-cheapest').get(top5Cheapest, getAllTours);
// ALIAS ROUTE END

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getOneTour).patch(updateTour).delete(deleteTour);

module.exports = router;
