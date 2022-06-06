const express = require('express');
const tourControllers = require('../controller/tourController');

const { getAllTours, createTour, getOneTour, updateTour, deleteTour } =
  tourControllers;

// TOURS ROUTES
const route = express.Router();
// route.param('id', checkId);
route.route('/').get(getAllTours).post(createTour);
route.route('/:id').get(getOneTour).patch(updateTour).delete(deleteTour);

module.exports = route;
