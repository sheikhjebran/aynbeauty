const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function recreateAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
    });

    console.log("Connected to database");

    // Delete existing admin user
    await connection.execute("DELETE FROM users WHERE email = ?", [
      "admin@aynbeauty.com",
    ]);
    console.log("Deleted existing admin user");

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);
    console.log(
      "Generated new password hash:",
      hashedPassword.substring(0, 20) + "..."
    );

    // Test the hash immediately
    const testHash = await bcrypt.compare("admin123", hashedPassword);
    console.log(
      "Hash test before insert:",
      testHash ? "✅ VALID" : "❌ INVALID"
    );

    // Create admin user
    const [result] = await connection.execute(
      `INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      ["Admin", "User", "admin@aynbeauty.com", hashedPassword, "admin"]
    );

    console.log("✅ New admin user created successfully!");
    console.log("Email: admin@aynbeauty.com");
    console.log("Password: admin123");

    // Verify the new user
    const [rows] = await connection.execute(
      "SELECT id, email, role, password FROM users WHERE email = ?",
      ["admin@aynbeauty.com"]
    );

    if (rows.length > 0) {
      const admin = rows[0];
      const finalTest = await bcrypt.compare("admin123", admin.password);
      console.log("Final verification:", finalTest ? "✅ VALID" : "❌ INVALID");
    }

    await connection.end();
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

recreateAdmin();
