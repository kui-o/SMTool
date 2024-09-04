require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_ID,
    password: process.env.DB_PW,
    database: 'smtool',
    charset: 'utf8mb4'
});

module.exports = {
    query: (sql, param = []) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if(err) return reject(err);
                conn.query(sql, param, (err, result) => {
                    if(err) return reject(err);
                    conn.release();
                    return resolve(result);
                });
            });
        });
    }
}
