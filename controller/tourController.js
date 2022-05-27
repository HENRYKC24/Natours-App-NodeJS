const fs = require('fs')
// GET DATA
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// REQUEST HANDLERS
exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  let ind = -1;
  const item = tours.find((tour, index) => {
    if (tour.id === id) {
      ind = index;
      return tour.id === id;
    }
  });
  if (!item) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const updatedTours = tours.filter((tour) => tour.id !== id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(204).json({
          status: 'success',
          data: null,
        });
      }
    }
  );
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.time,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getOneTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'failure',
      message: 'No tour with the provided id!',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      }
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  let ind = -1;
  const item = tours.find((tour, index) => {
    if (tour.id === id) {
      ind = index;
      return tour.id === id;
    }
  });
  if (!item) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const reqData = req.body;
  tours.splice(ind, 1);
  const updatedTour = { ...item, ...reqData };
  tours.splice(ind, 0, updatedTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(201).json({
          status: 'success',
          data: {
            tour: updatedTour,
          },
        });
      }
    }
  );
};
