require('dotenv').config();

const express = require('express');
const rateLimit = require("express-rate-limit");

const router = express.Router();
const craftsService = require('../../service/crafts.js');
const loginService = require("../../service/login");
const valid = require("../../config/validate");


router.get('/', async (req, res) => {
    const body = await craftsService.getCraftsList();
    body.success ? res.json(body) : res.status(500).json(body);
});

router.get('/items/:id', async (req, res) => {
    const id = req.params.id;
    const body = await craftsService.getCrafts(id);
    body.success ? res.json(body) : res.status(500).json(body);
});

const prefLimiter = rateLimit({
    windowMs: 10000,
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
        if(!valid.cpValid(j)){
            return res.status(400).json({
                success: false,
                code: 'PPJ_INV'
            });
        }
        const result = await craftsService.updatePreference(id.body, j);
        result.success ? res.json(result) : res.status(500).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            code: 'MP_TC'
        })
    }
});

module.exports = router;