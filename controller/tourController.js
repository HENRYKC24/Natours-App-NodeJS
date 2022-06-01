const fs = require('fs');

// GET DATA
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, id) => {
  const item = tours.find((tour) => tour.id === id * 1);

  if (!item)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  next();
};

// REQUEST HANDLERS
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const updatedTours = tours.filter((tour) => tour.id !== id);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
  const tour = tours.find((item) => item.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
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
  const newId = tours[tours.length - 1].id + 1;
  const newTour = req.body;
  newTour.id = newId;
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
  const { id } = req.params;
  const item = tours.find((tour) => tour.id === id * 1);
  const reqData = req.body;
  const ind = tours.indexOf(item);
  tours.splice(ind, 1);
  // eslint-disable-next-line prefer-object-spread
  const updatedTour = Object.assign({ item, reqData });
  tours.splice(ind, 0, updatedTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
