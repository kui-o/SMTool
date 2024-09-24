require('dotenv').config();
const express = require('express');
const router = express.Router();

const TITLE = '쌀먹툴 : 제작 계산기 - 로스트아크 도구 모음 사이트';

router.get('/', function(req, res) {
    res.render('crafts/index', {
        title: TITLE,
        version: process.env.PUBLIC_VERSION,
        url: process.env.BACK_URL
    });
});

router.get("/:id", function(req, res) {
    res.render('crafts/detail', {
        title: TITLE,
        version: process.env.PUBLIC_VERSION,
        url: process.env.BACK_URL,
        id: req.params.id,
    })
});

module.exports = router;