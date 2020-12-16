const express = require('express');
const path = require('path');
const router = require('./route');

const app = express();

app.set('port', 5000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(router);

app.use((req, res, next) => {
  res.status(404).send(path.join(__dirname, '..', 'public', '404.html'));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(path.join(__dirname, '..', 'public', '500.html'));
});

module.exports = app;
