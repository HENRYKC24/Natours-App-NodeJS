const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
