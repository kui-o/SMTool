require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const mainService = require('../../service/main.js');
const loginService = require('../../service/login.js');

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
});

const limiter = rateLimit({
    windowMs: 10000,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            code: 'TOO_MANY_LOGIN_REQUEST'
        });
    },
});
router.post('/login', limiter, async (req, res) => {
    const {code} = req.body;
    if(!code){
        return res.status(400).json({
            success: false,
            code: 'LPC_MIS'
        });
    }

    if(!/^[a-zA-Z0-9]+$/.test(code)){
        return res.status(400).json({
            success: false,
            code: 'LPC_INV'
        });
    }

    const token = await loginService.login(code);
    if(!token.success){
        return res.status(500).json({
            success: false,
            code: token.code
        });
    }
    res.json({
        success: true,
        body: token.body
    });
});
router.get('/login', async (req, res) => {
    if(!req.headers.authorization) {
        return res.status(401).json({
            success: false,
            code: 'LHD_MIS'
        })
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const userName = await loginService.getUser(token);
        if(!userName.success){
            return res.status(401).json({
                success: false,
                code: userName.code
            })
        }
        res.json({
            success: true,
            body: userName.body
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            code: 'L_TC'
        })
    }
});



module.exports = router;