require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();

const mainRouter = require('./routes/back/main.js');
const craftsRouter = require('./routes/back/crafts.js');

app.use(compression());

app.use(cors({
    origin: process.env.FRONT_URL
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/main', mainRouter);
app.use('/crafts', craftsRouter);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        msg: '존재하지 않는 페이지입니다.'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        code: 'UNKNOWN_ERROR'
    });
});

module.exports = app;