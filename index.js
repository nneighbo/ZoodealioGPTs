const express = require('express');
const path = require('path');
const app = express();

const routes = require('./routes');

require('dotenv').config();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
