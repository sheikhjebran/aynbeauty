const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

async function resetAdminUser() {
  console.log("🔄 Resetting admin user with correct password hash...\n");

  try {
    // Hash the password correctly
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`✅ Generated new password hash: ${hashedPassword}`);

    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ Connected to database");

    // Update the admin user with correct password hash
    const updateQuery = `
      UPDATE users 
      SET password = ?, 
          updated_at = NOW()
      WHERE email = ? AND role = 'admin'
    `;

    const [result] = await connection.execute(updateQuery, [
      hashedPassword,
      "admin@aynbeauty.com",
    ]);
    console.log("✅ Updated admin user password hash");

    // Verify the update
    const verifyQuery = `
      SELECT id, email, role, first_name, last_name, is_active, email_verified, 
             LEFT(password, 30) as password_preview
      FROM users 
      WHERE email = ? AND role = 'admin'
    `;

    const [verifyResult] = await connection.execute(verifyQuery, [
      "admin@aynbeauty.com",
    ]);

    if (verifyResult.length > 0) {
      const admin = verifyResult[0];
      console.log("\n✅ Admin user verified:");
      console.log(`   ID: ${admin.id}`);
      console.log(`   Name: ${admin.first_name} ${admin.last_name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.is_active}`);
      console.log(`   Email Verified: ${admin.email_verified}`);
      console.log(`   Password Preview: ${admin.password_preview}...`);

      // Test the password
      const fullUserQuery = `SELECT password FROM users WHERE email = ? AND role = 'admin'`;
      const [fullResult] = await connection.execute(fullUserQuery, [
        "admin@aynbeauty.com",
      ]);

      if (fullResult.length > 0) {
        const isPasswordValid = await bcrypt.compare(
          password,
          fullResult[0].password
        );
        console.log(
          `   Password Test: ${isPasswordValid ? "✅ VALID" : "❌ INVALID"}`
        );
      }
    } else {
      console.log("❌ Admin user not found after update");
    }

    await connection.end();
    console.log("\n✅ Admin user password has been reset successfully!");
    console.log("\nYou can now login with:");
    console.log("Email: admin@aynbeauty.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("❌ Error resetting admin user:", error);
  }
}

resetAdminUser();
