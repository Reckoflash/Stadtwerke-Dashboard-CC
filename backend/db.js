const mysql = require('mysql2/promise');

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

// Mini-Debug
console.log('DB CONFIG:', { host, port, user, database });

if (!host || !port || !user || !password || !database) {
  console.error('Missing DB env vars. Check Render Environment settings.');
}

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,

  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  charset: 'utf8mb4',
});

module.exports = pool;
