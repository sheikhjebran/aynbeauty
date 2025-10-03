const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function debugAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
    });

    console.log("Connected to database");

    // Get admin user details
    const [rows] = await connection.execute(
      "SELECT id, first_name, last_name, email, role, password, is_active, email_verified FROM users WHERE email = ?",
      ["admin@aynbeauty.com"]
    );

    if (rows.length === 0) {
      console.log("❌ Admin user not found!");
      await connection.end();
      return;
    }

    const admin = rows[0];
    console.log("✅ Admin user found:");
    console.log("ID:", admin.id);
    console.log("Name:", admin.first_name, admin.last_name);
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Is Active:", admin.is_active);
    console.log("Email Verified:", admin.email_verified);
    console.log("Password Hash:", admin.password.substring(0, 20) + "...");

    // Test password comparison
    const testPassword = "admin123";
    const isValidPassword = await bcrypt.compare(testPassword, admin.password);
    console.log(
      "Password test (admin123):",
      isValidPassword ? "✅ VALID" : "❌ INVALID"
    );

    // Test with different password to confirm bcrypt is working
    const wrongPassword = await bcrypt.compare("wrongpassword", admin.password);
    console.log(
      "Wrong password test:",
      wrongPassword
        ? "❌ WRONG - Should be false"
        : "✅ Correct - False as expected"
    );

    await connection.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

debugAdmin();
