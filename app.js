const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this URL.');
// });

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/d-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  })
});

const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
