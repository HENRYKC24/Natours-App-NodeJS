const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

// SET UP APP
const app = express();

// USE MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  req.time = new Date().toISOString();
  next();
});

// GET DATA
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// REQUEST HANDLERS
const deleteTour = (req, res) => {
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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.time,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getOneTour = (req, res) => {
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

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// TOURS ROUTES
const tourEndpoint = '/api/v1/tours';
app.route(tourEndpoint).get(getAllTours).post(createTour);
app
  .route(`${tourEndpoint}/:id`)
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

// USERS ROUTES
const userEndpoint = '/api/v1/users';
app.route(userEndpoint).get(getUsers).post(createUser);
app
  .route(`${userEndpoint}/:id`)
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// RUN SERVER
const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
