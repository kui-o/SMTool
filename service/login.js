require('dotenv').config();
const axios = require('axios');
const { v4: UUID } = require('uuid');
const db = require('../config/db.js');
const jwt = require('jsonwebtoken');

async function fetchDiscordToken(code){
    try{
        const url = 'https://discord.com/api/oauth2/token';
        const params = {
            'client_id': process.env.DISCORD_ID,
            'client_secret': process.env.DISCORD_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.FRONT_URL+'/login'
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        const response = await axios.post(url, params, {headers:headers});
        if(response.status !== 200){
            return {
                success: false,
                code: 'MSGF_DT_ST'
            }
        }
        if(!response.data.access_token){
            return {
                success: false,
                code: 'MSGF_DT_MIS'
            }
        }
        return {
            success: true,
            body: response.data.access_token
        }
    } catch(err){
        console.error(err);
        return {
            success: false,
            code: 'MSGF_DT_TC'
        }
    }
}

async function fetchDiscordProfile(token){
    try {
        const url = 'https://discord.com/api/users/@me';
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        const response = await axios.get(url, {headers:headers});
        if(response.status !== 200){
            return {
                success: false,
                code: 'MSGF_DP_ST'
            }
        }
        if(!response.data.id){
            return {
                success: false,
                code: 'MSGF_DP_MIS'
            }
        }
        return {
            success: true,
            body: {
                id: response.data.id,
                handle: response.data.username,
                name: response.data.global_name
            }
        }
    } catch(err) {
        console.error(err);
        return {
            success: false,
            code: 'MSGF_DP_TC'
        }
    }
}

async function updateUserData(user){
    try {
        const [data] = await db.query('SELECT * FROM users WHERE user_id=?', [user.id]);
        if(!data){
            await db.queryAll([{
                sql: 'INSERT INTO users (user_id, user_handle, user_name) VALUES (?, ?, ?)',
                params: [user.id, user.handle, user.name]
            },{
                sql: 'INSERT INTO preferences (user_id) VALUES (?)',
                params: [user.id]
            }]);
        } else if(data.userHandle !== user.handle || data.userName !== user.name){
            await db.queryAll([{
                sql: 'UPDATE users SET user_handle=?, user_name=? WHERE user_id=?',
                params: [user.handle, user.name, user.id],
            }]);
        }
        return {success: true};
    } catch(err) {
        console.error(err);
        return {
            success: false,
            code: "MSGUD_TC"
        }
    }
}

async function createSessionKey(userId){
    try{
        const uuid = UUID().replace(/-/g, '');
        await db.queryAll([{
            sql: 'DELETE FROM sessions WHERE user_id=?',
            params: [userId]
        },{
            sql: 'INSERT INTO sessions (session_key, user_id) values (?, ?)',
            params: [uuid, userId]
        }]);
        const [key] = await db.query('SELECT session_key FROM sessions WHERE user_id=?', [userId]);
        if(!key){
            return {
                success: false,
                code: 'MSGSK_MIS'
            }
        }

        return {
            success: true,
            body: key.sessionKey
        }
    } catch(err) {
        console.error(err);
        return {
            success: false,
            code: 'MSGC_SK_TC'
        }
    }
}


module.exports = {
    login: async (code)=>{
        try{
            const discordToken = await fetchDiscordToken(code);
            if(!discordToken.success){
                return {
                    success: false,
                    code: discordToken.code
                }
            }

            const profile = await fetchDiscordProfile(discordToken.body);
            if(!profile.success){
                return {
                    success: false,
                    code: profile.code
                }
            }

            const result = await updateUserData(profile.body);
            if(!result.success){
                return {
                    success: false,
                    code: result.code
                }
            }

            const session = await createSessionKey(profile.body.id);
            if(!session.success){
                return {
                    success: false,
                    code: session.code
                }
            }

            return {
                success: true,
                body: jwt.sign({key:session.body}, process.env.JWT_KEY)
            }

        } catch(err) {
            return {
                success: false,
                code: "MSGLG_TC"
            }
        }
    },
    getUser: async (id)=>{
        try{
            const [user] = await db.query('SELECT user_name FROM users WHERE user_id=?', [id]);
            if(!user){
                return {
                    success: false,
                    code: 'LSG_US_INV'
                }
            }
            const [preference] = await db.query('SELECT * from preferences WHERE user_id=?', [id]);
            if(preference) delete preference.userId;
            return {
                success: true,
                body: {
                    name: user.userName,
                    preference: preference
                }
            }
        } catch(err) {
            console.error(err);
            return {
                success: false,
                code: "LSG_JT_TC"
            }
        }

    },
    getUserId: async (token)=>{
        try{
            jwt.verify(token, process.env.JWT_KEY);
            const payload = jwt.decode(token);
            const [session] = await db.query('SELECT user_id FROM sessions WHERE session_key=?', [payload.key]);
            if(!session){
                return {
                    success: false,
                    code: 'LSG_SE_INV'
                }
            }
            return {
                success: true,
                body: session.userId
            }
        } catch(err) {
            console.error(err);
            return {
                success: false,
                code: 'LSG_UI_TC'
            }
        }
    },
    logout: async (token)=>{
        try{
            jwt.verify(token, process.env.JWT_KEY);
            const payload = jwt.decode(token);
            await db.queryAll([{
                sql: 'DELETE FROM sessions WHERE session_key=?',
                params: [payload.key]
            }]);
        } finally {
            return { success: true }
        }
    }
}