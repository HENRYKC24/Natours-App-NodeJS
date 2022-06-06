const express = require('express');
const tourControllers = require('../controller/tourController');

const {
  validateTourProps,
  getAllTours,
  createTour,
  getOneTour,
  updateTour,
  deleteTour,
  // checkId,
} = tourControllers;

// TOURS ROUTES
const route = express.Router();
// route.param('id', checkId);
route.route('/').get(getAllTours).post(validateTourProps, createTour);
route.route('/:id').get(getOneTour).patch(updateTour).delete(deleteTour);

module.exports = route;
