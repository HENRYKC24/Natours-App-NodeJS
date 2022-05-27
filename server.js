const app = require('./app');
// RUN SERVER
const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
