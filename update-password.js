// Update password for testing user
const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aynbeauty",
  connectTimeout: 60000,
  multipleStatements: true,
};

async function updatePassword() {
  let connection;

  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    // Import bcryptjs (used in the app)
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("password123", 10);

    await connection.execute(`UPDATE users SET password = ? WHERE email = ?`, [
      hashedPassword,
      "sheikhjebran@gmail.com",
    ]);

    console.log("✓ Password updated for sheikhjebran@gmail.com");
    console.log("New password: password123");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updatePassword().catch(console.error);
