const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'rootpw',
  database: 'stadtwerke',
  charset: 'UTF8MB4_GENERAL_CI',
  decimalNumbers: true,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
