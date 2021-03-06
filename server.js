const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: Server shutting down...');
  console.log(err.name, '\n', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.MONGODB_REMOTE_SERVER.replace(
  '<PASSWORD>',
  process.env.MONGODB_PASSWORD
);
mongoose
  // .connect(process.env.MONGODB_LOCAL_SERVER, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection successful'));

// RUN SERVER
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION: Server shutting down...');
  console.log(err.name, '\n', err.message);
  server.close(() => {
    process.exit(1);
  });
});
