require('dotenv').config();
const express = require('express');
const vhost = require('vhost');

const app = express();

const front = require('../front.js');
const back = require('../back.js');

app.use(vhost(process.env.FRONT_HOST, front));
app.use(vhost(process.env.BACK_HOST, back));

app.use((req, res, next) => {
    req.socket.destroy();
});

app.listen(process.env.PORT, () => {});