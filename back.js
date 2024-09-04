const express = require('express');
const app = express();

const mainRouter = require('./routes/back/main.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/main', mainRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        code: 'UNKNOWN_ERROR'
    });
});

module.exports = app;