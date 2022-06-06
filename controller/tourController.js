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

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
