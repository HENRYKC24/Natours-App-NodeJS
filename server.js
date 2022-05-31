const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
// RUN SERVER
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
