require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ID,
    password: process.env.DB_PW,
    database: 'smtool',
    charset: 'utf8mb4'
}).promise();

function getCamelKey(snakeCase) {
    return snakeCase.replace(/(_\w)/g, matches => matches[1].toUpperCase());
}

function keysToCamel(obj) {
    if (obj instanceof Array) {
        return obj.map(item => keysToCamel(item));
    } else if (obj instanceof Object) {
        const newObj = {};
        Object.keys(obj).forEach(key => {
            const camelKey = getCamelKey(key);
            newObj[camelKey] = obj[key];
        });
        return newObj;
    }
    return obj;
}

module.exports = {
    query: async (sql, param = []) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const [data] = await conn.query(sql, param);
            return keysToCamel(data);
        } catch(err) {
            console.error(err);
            throw err;
        } finally {
            if(conn) conn.release();
        }
    },
    queryArray: async (sql, param = []) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const [data] = await conn.query(sql, [param]);
            return keysToCamel(data);
        } catch(err) {
            console.error(err);
            throw err;
        } finally {
            if(conn) conn.release();
        }
    },
    queryAll: async (queryList) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            for (const item of queryList) {
                await conn.query(item.sql, item.params);
            }
            await conn.commit();
        } catch(err) {
            if(conn) await conn.rollback();
            console.error(err);
            throw err;
        } finally {
            if(conn) conn.release();
        }
    },
    getPoolConnection: async() => {
        return await pool.getConnection();
    }
}
