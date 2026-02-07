const mysql = require('mysql2/promise');

function parseMysqlUrl(url) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: Number(u.port || 3306),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname?.replace('/', '') || undefined,
    };
  } catch {
    return null;
  }
}

// 1) Prefer explicit DB_* (Render-friendly)
let host = process.env.DB_HOST;
let port = Number(process.env.DB_PORT);
let user = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
let database = process.env.DB_NAME;

// 2) Fallback: Railway style (best is MYSQL_PUBLIC_URL if present)
if (!host || !port || !user || !password || !database) {
  const url = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || process.env.DATABASE_URL;

  const parsed = url ? parseMysqlUrl(url) : null;

  if (parsed) {
    host = host || parsed.host;
    port = port || parsed.port;
    user = user || parsed.user;
    password = password || parsed.password;
    database = database || parsed.database;
  }
}

// Mini-Debug (ohne Passwort)
console.log('DB CONFIG:', { host, port, user, database });

if (!host || !port || !user || !password || !database) {
  console.error('Missing DB env vars. Check Render/Railway environment settings.');
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
