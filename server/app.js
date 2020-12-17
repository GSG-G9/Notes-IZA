const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('./route');
require('env2')('./config.env');

const app = express();

app.set('port', process.env.PORT || 5000);
app.use(express.json());
app.use(cookieParser());
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
