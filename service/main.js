require('dotenv').config();
const axios = require('axios');
const { v4: UUID } = require('uuid');
const db = require('../config/db.js');


const loaNotice = {
    notices: [],
    lastUpdate: 0
}

module.exports = {
    getLoaNotices: async ()=>{
        const now = new Date();
        if(now - loaNotice.lastUpdate > 180 * 1000){
            try {
                const url = 'https://developer-lostark.game.onstove.com/news/notices';
                const headers = {
                    'Authorization': `Bearer ${process.env.LOA_API_TOKEN}`,
                    'Accept': 'application/json',
                }
                const response = await axios.get(url, {headers: headers});
                if(response.status === 429){
                    console.error("LOA_NOTICE_API_LIMIT");
                    return {
                        success: false,
                        code: "LOA_NOTICE_API_LIMIT"
                    }
                } else if(response.status !== 200){
                    return {
                        success: false,
                        code: "MSGLN_POST_ST"
                    }
                }
                const noticeList = response.data.splice(0, 4).map(item => ({
                   title: item.Title,
                   link: item.Link
                }));
                loaNotice.notices = noticeList;
                loaNotice.lastUpdate = now;

            } catch(e){
                return {
                    success: false,
                    code: "MSGLN_POST_TC"
                }
            }
        }

        return {
            success: true,
            body: loaNotice.notices
        };
    },

    getSMNotices: async ()=>{
        try {
            const data = await db.query('SELECT title, content, publish_date FROM notices WHERE is_deleted=0 ORDER BY publish_date DESC LIMIT 5');
            return {
                success: true,
                body: data
            }
        } catch(err){
            return {
                success: false,
                code: "MSGSN_POST_TC"
            }
        }
    }
}