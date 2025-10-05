const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

class AdminPasswordReset {
  constructor() {
    // Extract database name from DB_NAME if it's a connection string
    let dbName = process.env.DB_NAME || "aynbeauty";

    if (dbName.includes("mysql://") || dbName.includes("@")) {
      const match = dbName.match(/\/([^?\/]+)(\?|$)/);
      if (match) {
        dbName = match[1];
      } else {
        dbName = "aynbeauty";
      }
    }

    this.config = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
      database: dbName,
    };

    this.connection = null;
  }

  async connect() {
    try {
      console.log("🔌 Connecting to MySQL database...");

      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
      });

      console.log("✅ Connected to MySQL successfully");
    } catch (error) {
      console.error("❌ Failed to connect to MySQL:", error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("🔌 Disconnected from MySQL");
    }
  }

  async resetAdminPassword() {
    try {
      console.log("🔐 Resetting Admin Password");
      console.log("==========================");
      console.log();

      await this.connect();

      // Check if admin user exists
      const [existingUsers] = await this.connection.execute(
        "SELECT id, email, role FROM users WHERE email = ? OR role = 'admin'",
        ["admin@aynbeauty.com"]
      );

      if (existingUsers.length === 0) {
        console.log("👤 No admin user found. Creating new admin user...");
        await this.createAdminUser();
      } else {
        console.log("👤 Admin user found. Updating password...");
        await this.updateAdminPassword(existingUsers[0].id);
      }

      console.log();
      console.log("✅ Admin credentials updated successfully!");
      console.log("========================================");
      console.log();
      console.log("🔑 Admin Login Credentials:");
      console.log("   Email: admin@aynbeauty.com");
      console.log("   Password: admin123");
      console.log();
      console.log("🚀 You can now login at: /auth/login");
    } catch (error) {
      console.error("❌ Failed to reset admin password:", error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async createAdminUser() {
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.connection.execute(
      `
      INSERT INTO users (
        email, 
        password, 
        first_name, 
        last_name, 
        role, 
        email_verified
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      ["admin@aynbeauty.com", hashedPassword, "Admin", "User", "admin", true]
    );

    console.log("✅ New admin user created");
  }

  async updateAdminPassword(userId) {
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.connection.execute(
      `
      UPDATE users 
      SET password = ?, 
          role = 'admin',
          email_verified = true,
          first_name = COALESCE(first_name, 'Admin'),
          last_name = COALESCE(last_name, 'User'),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [hashedPassword, userId]
    );

    console.log("✅ Admin password updated");
  }

  async showAdminInfo() {
    try {
      await this.connect();

      console.log("👤 Current Admin Users");
      console.log("=====================");
      console.log();

      const [adminUsers] = await this.connection.execute(
        "SELECT id, email, first_name, last_name, role, email_verified, created_at FROM users WHERE role = 'admin'"
      );

      if (adminUsers.length === 0) {
        console.log("❌ No admin users found");
      } else {
        adminUsers.forEach((user, index) => {
          console.log(`Admin ${index + 1}:`);
          console.log(`   ID: ${user.id}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Name: ${user.first_name} ${user.last_name}`);
          console.log(`   Role: ${user.role}`);
          console.log(`   Verified: ${user.email_verified ? "Yes" : "No"}`);
          console.log(`   Created: ${user.created_at}`);
          console.log();
        });
      }
    } catch (error) {
      console.error("❌ Failed to get admin info:", error.message);
    } finally {
      await this.disconnect();
    }
  }
}

// Command line interface
const command = process.argv[2] || "reset";

async function main() {
  const resetTool = new AdminPasswordReset();

  switch (command) {
    case "reset":
      await resetTool.resetAdminPassword();
      break;

    case "info":
      await resetTool.showAdminInfo();
      break;

    default:
      console.log("🔐 Admin Password Reset Tool");
      console.log("============================");
      console.log();
      console.log("Usage:");
      console.log(
        "  npm run admin:reset     # Reset admin password to 'admin123'"
      );
      console.log("  npm run admin:info      # Show current admin users");
      console.log();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AdminPasswordReset;
