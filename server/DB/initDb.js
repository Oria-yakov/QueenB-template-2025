// הרצה: node server/DB/initDb.js
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function run() {
  const connectionConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Oria706385", // <<< אם יש סיסמה ל-MySQL, כתבי אותה כאן
    multipleStatements: true,
  };

  // schema.sql חייב להיות באותה תיקייה של הקובץ הזה (server/DB/)
  const schemaPath = path.join(__dirname, "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error("❌ schema.sql not found at", schemaPath);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  const conn = await mysql.createConnection(connectionConfig);
  try {
    console.log(
      `🔗 Connected to MySQL at ${connectionConfig.host}:${connectionConfig.port} as ${connectionConfig.user}`
    );
    await conn.query(schemaSql);
    console.log("✅ Database & tables created/ensured (queens_match)");
  } catch (err) {
    console.error("❌ Error setting up database:", err.message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

run();
