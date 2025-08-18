// node server/DB/initDb.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Aa123456', // שלך
    multipleStatements: true
  };

  const schemaPath = path.join(__dirname, 'schema.sql');
  let schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // הסרת BOM אם קיים בתחילת הקובץ
  if (schemaSql.charCodeAt(0) === 0xFEFF) {
    schemaSql = schemaSql.slice(1);
  }

  const conn = await mysql.createConnection(connectionConfig);
  try {
    console.log(`🔗 Connected to MySQL at ${connectionConfig.host}:${connectionConfig.port} as ${connectionConfig.user}`);
    await conn.query(schemaSql);
    console.log('✅ Database & tables created/ensured (queens_match)');
  } catch (err) {
    console.error('❌ Error setting up database:', err.message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}
run();
