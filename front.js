const express = require('express');
const app = express();
const layout = require('express-ejs-layouts');

const path = require("path");

const mainRouter = require('./routes/front/main.js');
const craftsRouter = require('./routes/front/crafts.js');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(layout);
app.set('layout', 'layout');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout extractMetas", true);

app.use('/crafts', craftsRouter);
app.use('/', mainRouter);

module.exports = app;