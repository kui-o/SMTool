require('dotenv').config();
const express = require('express');
const router = express.Router();

const mainService = require('../../service/main.js');

router.get('/loa-notices', async (req, res) => {
    const notices = await mainService.getLoaNotices();
    if(!notices.success){
        return res.status(500).json({
            success: false,
            code: notices.code
        });
    }
    res.json({
        success: true,
        body: notices.body
    });
});

router.get('/sm-notices', async (req, res) => {
    const notices = await mainService.getSMNotices();
    if(!notices.success){
        return res.status(500).json({
            success: false,
            code: notices.code
        });
    }

    res.json({
        success: true,
        body: notices.body
    });
})

module.exports = router;