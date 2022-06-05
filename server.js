const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

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

const app = require('./app');
// RUN SERVER
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
