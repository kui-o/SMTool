require('dotenv').config();
const express = require('express');
const router = express.Router();

const {getLoaNotice} = require('../../service/main.js');

router.get('/notice', async (req, res, next) => {
    const loaNotices = await getLoaNotice();
    if(!loaNotices.success){
        return res.status(500).json({
            success: false,
            code: loaNotices.code
        });
    }

    res.json({
        success: true,
        body: {
            loaNotices: loaNotices.body
        }
    });
});

module.exports = router;