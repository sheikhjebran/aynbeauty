const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
    });

    console.log("Connected to database");

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Check if admin already exists
    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      ["admin@aynbeauty.com"]
    );

    if (existing.length > 0) {
      console.log("Admin user already exists");
      await connection.end();
      return;
    }

    // Create admin user
    const [result] = await connection.execute(
      `INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      ["Admin", "User", "admin@aynbeauty.com", hashedPassword, "admin"]
    );

    console.log("Admin user created successfully!");
    console.log("Email: admin@aynbeauty.com");
    console.log("Password: admin123");

    await connection.end();
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdmin();
