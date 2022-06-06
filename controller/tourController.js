const Tour = require('../models/tourModel');

// GET DATA

// REQUEST HANDLERS
exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.getOneTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.validateTourProps = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price)
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name and/or price',
    });
  next();
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
