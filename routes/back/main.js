require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const mainService = require('../../service/main.js');
const loginService = require('../../service/login.js');
const valid = require('../../config/validate.js');

router.get('/loa-notices', async (req, res) => {
    const notices = await mainService.getLoaNotices();
    notices.success ? res.json(notices) : res.status(500).json(notices);
});

router.get('/sm-notices', async (req, res) => {
    const notices = await mainService.getSMNotices();
    notices.success ? res.json(notices) : res.status(500).json(notices);
});

const loginLimiter = rateLimit({
    windowMs: 10000,
    max: 2,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            code: 'TOO_MANY_LOGIN_REQUEST'
        });
    },
});
router.post('/login', loginLimiter, async (req, res) => {
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
    token.success ? res.json(token) : res.status(500).json(token);
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
        const id = await loginService.getUserId(token);
        if(!id.success){
            return res.status(401).json(id);
        }
        const user = await loginService.getUser(id.body);
        user.success ? res.json(user) : res.status(500).json(user);
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            code: 'L_TC'
        })
    }
});

const prefLimiter = rateLimit({
    windowMs: 5000,
    max: 3,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            code: 'TOO_MANY_UPDATE_REQUEST'
        });
    },
});
router.post('/preference', prefLimiter, async (req, res) => {
    if(!req.headers.authorization) {
        return res.status(401).json({
            success: false,
            code: 'LHD_MIS'
        })
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const id = await loginService.getUserId(token);
        if(!id.success){
            return res.status(401).json(id);
        }
        const {j} = req.body;
        if(!j) {
            return res.status(400).json({
                success: false,
                code: 'PPJ_MIS'
            });
        }
        if(!valid.gpValid(j)){
            return res.status(400).json({
                success: false,
                code: 'PPJ_INV'
            });
        }
        const result = await mainService.updatePreference(id.body, j);
        result.success ? res.json(result) : res.status(500).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            code: 'MP_TC'
        })
    }
});

router.post('/logout', async (req, res) => {
    if(!req.headers.authorization) {
        return res.json({success:true});
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        await loginService.logout(token);
    } finally {
        res.json({success:true});
    }
});



module.exports = router;