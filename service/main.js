const axios = require('axios');


const loaNotice = {
    notices: [],
    lastUpdate: 0
}

async function getLoaNotice(){
    const now = new Date();
    if(now - loaNotice.lastUpdate > 180 * 1000){
        try {
            const url = 'https://developer-lostark.game.onstove.com/news/notices';
            const header = {
                'Authorization': `Bearer ${process.env.LOA_API_TOKEN}`,
                'Accept': 'application/json',
            }
            const response = await axios.get(url, {headers: header});
            if(response.status !== 200){
                return {
                    success: false,
                    code: "MSGLN_POST_ST"
                }
            }
            const noticeList = [];
            response.data.splice(0, 4).forEach((item) => {
                noticeList.push({
                   title: item.Title,
                   link: item.Link
                });
            })
            loaNotice.notices = noticeList;
            loaNotice.lastUpdate = now;

        } catch(e){
            console.error(e);
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
}

module.exports = {
    getLoaNotice
}