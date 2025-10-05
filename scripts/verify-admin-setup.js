const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

async function verifyAdminSetup() {
  console.log("🔍 ADMIN SETUP VERIFICATION\n");

  try {
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ Database connection successful");

    // Check admin user
    const [result] = await connection.execute(
      "SELECT id, email, role, first_name, last_name, is_active, email_verified, password FROM users WHERE email = ? AND role = ?",
      ["admin@aynbeauty.com", "admin"]
    );

    if (result.length === 0) {
      console.log("❌ Admin user not found");
      await connection.end();
      return;
    }

    const admin = result[0];
    console.log("\n📋 Admin User Details:");
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.first_name} ${admin.last_name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Active: ${admin.is_active ? "✅ Yes" : "❌ No"}`);
    console.log(
      `   Email Verified: ${admin.email_verified ? "✅ Yes" : "❌ No"}`
    );

    // Test password
    const isPasswordValid = await bcrypt.compare("admin123", admin.password);
    console.log(
      `   Password Test: ${isPasswordValid ? "✅ Valid" : "❌ Invalid"}`
    );

    await connection.end();

    // Test JWT secret
    const jwtSecret = process.env.JWT_SECRET;
    console.log(
      `\n🔐 JWT Secret: ${jwtSecret ? "✅ Configured" : "❌ Missing"}`
    );

    // Summary
    console.log("\n🎯 SETUP STATUS:");
    if (
      admin.is_active &&
      admin.email_verified &&
      isPasswordValid &&
      jwtSecret
    ) {
      console.log("✅ ADMIN LOGIN READY!");
      console.log("\n🚀 To test:");
      console.log("1. Visit: http://localhost:3000/auth/login");
      console.log("2. Email: admin@aynbeauty.com");
      console.log("3. Password: admin123");
      console.log("4. Should redirect to /admin dashboard");
    } else {
      console.log("❌ Setup incomplete - check issues above");
    }
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }
}

verifyAdminSetup();
