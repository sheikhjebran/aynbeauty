// Check database users for testing
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

async function checkUsers() {
  let connection;

  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    const [users] = await connection.execute(
      `SELECT id, email, first_name, last_name, role, is_active, email_verified FROM users WHERE email = 'sheikhjebran@gmail.com'`
    );

    console.log("Found users:");
    console.table(users);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUsers().catch(console.error);
