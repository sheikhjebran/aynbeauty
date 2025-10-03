const mysql = require("mysql2/promise");

async function fixAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
    });

    console.log("Connected to database");

    // Update admin user to set email_verified = 1
    const [result] = await connection.execute(
      "UPDATE users SET email_verified = 1 WHERE email = ?",
      ["admin@aynbeauty.com"]
    );

    console.log(
      "✅ Admin user updated:",
      result.affectedRows,
      "row(s) affected"
    );

    // Verify the update
    const [rows] = await connection.execute(
      "SELECT email, is_active, email_verified FROM users WHERE email = ?",
      ["admin@aynbeauty.com"]
    );

    if (rows.length > 0) {
      const admin = rows[0];
      console.log("✅ Updated admin status:");
      console.log("Email:", admin.email);
      console.log("Is Active:", admin.is_active);
      console.log("Email Verified:", admin.email_verified);
    }

    await connection.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

fixAdmin();
