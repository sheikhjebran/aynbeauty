// Create test user for authentication testing
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: ".env.local" });

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aynbeauty",
  connectTimeout: 60000,
  multipleStatements: true,
};

async function createTestUser() {
  let connection;

  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    // Check if test user already exists
    const [existing] = await connection.execute(
      `SELECT id FROM users WHERE email = ?`,
      ["test@example.com"]
    );

    if (existing.length > 0) {
      console.log("Test user already exists");
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    await connection.execute(
      `INSERT INTO users (email, password, first_name, last_name, role, email_verified) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ["test@example.com", hashedPassword, "Test", "User", "customer", true]
    );

    console.log("✓ Test user created successfully");
    console.log("Email: test@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTestUser().catch(console.error);
