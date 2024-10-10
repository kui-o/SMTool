require('dotenv').config();
const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
    res.render('main/index', {
        title: '쌀먹툴 - 로스트아크 도구 모음 사이트',
        url: process.env.BACK_URL
    });
});

router.get('/login', function(req, res, next) {
    res.render('main/login', {
        layout: false,
        title: '쌀먹툴 - 로스트아크 도구 모음 사이트',
        url: process.env.BACK_URL
    })
});

module.exports = router;