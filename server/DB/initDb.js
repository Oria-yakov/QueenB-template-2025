// הפעלה: node server/DB/initDb.js
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
    password: '',   // <<< הסיסמה שלך
    multipleStatements: true
  };

  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ schema.sql not found at', schemaPath);
    process.exit(1);
  }
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

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
