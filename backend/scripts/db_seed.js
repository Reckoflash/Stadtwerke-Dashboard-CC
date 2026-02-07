require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runSqlFile(conn, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`\n==> Running: ${path.basename(filePath)}`);
  await conn.query(sql);
  console.log(`✅ OK: ${path.basename(filePath)}`);
}

async function main() {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !port || !user || !password || !database) {
    console.error('❌ Missing DB env vars in backend/.env');
    process.exit(1);
  }

  // Wichtig: multipleStatements, damit SOURCE-ähnlich ganze Dateien laufen
  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  const [info] = await conn.query('SELECT @@hostname AS host, @@port AS port, DATABASE() AS db');
  console.log('DB TARGET (same as backend):', info[0]);

  const sqlDir = path.join(__dirname, '..', 'sql');

  // Reihenfolge ist entscheidend:
  // 1) schema.sql (Basis-Tabellen)
  // 2) 03_domain.sql (neue Domain-Tabellen + FKs)
  // 3) 04_domain_seed.sql (Domain-Seed – braucht customers/products!)
  //
  // ABER: Du hast aktuell KEINE customers-seeds in schema.sql.
  // Darum führen wir VOR 04_domain_seed.sql noch ein Seed-File aus, das wir gleich anlegen.
  const files = [
    path.join(sqlDir, 'schema.sql'),
    path.join(sqlDir, '03_domain.sql'),
    path.join(sqlDir, '02_seed_core.sql'),
    path.join(sqlDir, '04_domain_seed.sql'),
  ];

  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`❌ Missing SQL file: ${f}`);
      process.exit(1);
    }
    await runSqlFile(conn, f);
  }

  // Mini-Checks
  const checks = [
    'SELECT COUNT(*) AS n FROM customers',
    'SELECT COUNT(*) AS n FROM products',
    'SELECT COUNT(*) AS n FROM market_locations',
    'SELECT COUNT(*) AS n FROM contracts',
  ];

  for (const q of checks) {
    const [r] = await conn.query(q);
    console.log(q, '=>', r[0].n);
  }

  await conn.end();
  console.log('\n✅ Done.');
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
