const express = require('express');
const app = express();

const mainRouter = require('./routes/back/main.js');

app.use('/', mainRouter);

module.exports = app;