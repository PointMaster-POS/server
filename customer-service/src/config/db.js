const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST ||'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'pointmaster',
    port: process.env.DB_PORT || 3308,
    charset: 'utf8mb4'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});


module.exports = db;