const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.MONGODB_REMOTE_SERVER.replace(
  '<PASSWORD>',
  process.env.MONGODB_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection successful'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log('All tours successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importTours = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours successfully loaded to database');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const arg = process.argv[2];

if (arg === '--import') {
  importTours();
} else if (arg === '--delete') {
  deleteTours();
}

// RUN 'node dev-data/data/import-data.js --delete'
// OR 'node dev-data/data/import-data.js --import'
// In the terminal to delete from or import data to the database.
