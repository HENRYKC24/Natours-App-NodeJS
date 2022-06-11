const express = require('express');
const tourControllers = require('../controller/tourController');

const {
  getAllTours,
  createTour,
  getOneTour,
  updateTour,
  deleteTour,
  top5Cheapest,
} = tourControllers;

// TOURS ROUTES
const route = express.Router();

// ALIAS ROUTE START
route.route('/top-5-cheapest').get(top5Cheapest, getAllTours);
// ALIAS ROUTE END

route.route('/').get(getAllTours).post(createTour);
route.route('/:id').get(getOneTour).patch(updateTour).delete(deleteTour);

module.exports = route;
