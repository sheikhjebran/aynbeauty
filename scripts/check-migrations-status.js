require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function checkMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "aynbeauty",
  });

  try {
    const [rows] = await connection.execute(
      "SELECT * FROM migrations ORDER BY executed_at"
    );
    console.log("Current migrations:", rows.length, "records");
    console.table(rows);
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkMigrations();
