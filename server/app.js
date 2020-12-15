const express = require('express');
const router = require('./route');
const path = require('path');
 const app = express();

 app.set('port',5000);
 app.use(express.json());
 app.use(express.static(path.join(__dirname,'..','public')));
 app.use(router);

 module.exports = app;  