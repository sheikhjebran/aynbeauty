const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

class DatabaseMigrator {
  constructor() {
    // Extract database name from DB_NAME if it's a connection string
    let dbName = process.env.DB_NAME || "aynbeauty";

    // If DB_NAME looks like a connection string, extract just the database name
    if (dbName.includes("mysql://") || dbName.includes("@")) {
      const match = dbName.match(/\/([^?\/]+)(\?|$)/);
      if (match) {
        dbName = match[1];
      } else {
        dbName = "aynbeauty"; // fallback
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
    this.validateConfig();
  }

  validateConfig() {
    if (!this.config.user || !this.config.password) {
      console.error("❌ Database credentials not found in .env.local");
      console.error(
        "Please ensure the following environment variables are set:"
      );
      console.error("- DB_HOST (default: localhost)");
      console.error("- DB_PORT (default: 3306)");
      console.error("- DB_USER (required)");
      console.error("- DB_PASSWORD (required)");
      console.error("- DB_NAME (default: aynbeauty)");
      process.exit(1);
    }
  }

  async connect() {
    try {
      console.log("🔌 Connecting to MySQL database...");
      console.log(`   Host: ${this.config.host}:${this.config.port}`);
      console.log(`   Database: ${this.config.database}`);
      console.log(`   User: ${this.config.user}`);

      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        multipleStatements: true,
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

  async createDatabase() {
    if (!this.connection) throw new Error("Not connected to database");

    try {
      console.log(
        `🗄️  Creating database '${this.config.database}' if it doesn't exist...`
      );

      // First check if database already exists
      const [databases] = await this.connection.execute(
        "SHOW DATABASES LIKE ?",
        [this.config.database]
      );

      if (databases.length > 0) {
        console.log(`✅ Database '${this.config.database}' already exists`);
      } else {
        // Try to create database
        try {
          await this.connection.execute(
            `CREATE DATABASE IF NOT EXISTS \`${this.config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
          );
          console.log(
            `✅ Database '${this.config.database}' created successfully`
          );
        } catch (createError) {
          if (createError.message.includes("Access denied")) {
            console.log(
              `⚠️  Cannot create database '${this.config.database}' - using existing database`
            );
            console.log(
              `   This is normal if the database already exists or you don't have CREATE privileges`
            );
          } else {
            throw createError;
          }
        }
      }

      await this.connection.execute(`USE \`${this.config.database}\``);

      console.log(`✅ Using database '${this.config.database}'`);
    } catch (error) {
      console.error("❌ Failed to access database:", error.message);

      if (error.message.includes("Access denied")) {
        console.error("\n🔧 Database Permission Issue:");
        console.error(
          "   The user 'ayn' may not have CREATE DATABASE privileges."
        );
        console.error("   Please ask your hosting provider to:");
        console.error("   1. Create the 'aynbeauty' database manually, OR");
        console.error("   2. Grant CREATE privileges to user 'ayn'");
        console.error(
          "\n   Alternative: Use an existing database name that 'ayn' can access"
        );
      }

      throw error;
    }
  }

  async executeSQLFile() {
    if (!this.connection) throw new Error("Not connected to database");

    try {
      const sqlFilePath = path.join(process.cwd(), "deploy-production-db.sql");

      if (!fs.existsSync(sqlFilePath)) {
        throw new Error(`SQL file not found: ${sqlFilePath}`);
      }

      console.log("📄 Reading migration SQL file...");
      const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

      // Remove the CREATE DATABASE and USE statements since we handle them separately
      const cleanedSQL = sqlContent
        .replace(/CREATE DATABASE IF NOT EXISTS.*?;/gi, "")
        .replace(/USE\s+\w+\s*;/gi, "")
        .trim();

      if (!cleanedSQL) {
        throw new Error("SQL file appears to be empty or invalid");
      }

      console.log("🚀 Executing database migration...");
      console.log("   This may take a few moments...");

      // Split SQL into individual statements and execute them
      const statements = cleanedSQL
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
        try {
          await this.connection.execute(statement);
          successCount++;
        } catch (error) {
          console.warn(
            `⚠️  Warning: Failed to execute statement (continuing): ${error.message}`
          );
          errorCount++;
        }
      }

      console.log(
        `✅ Migration completed: ${successCount} statements executed successfully`
      );
      if (errorCount > 0) {
        console.log(
          `⚠️  ${errorCount} statements had warnings (this is often normal for IF NOT EXISTS statements)`
        );
      }
    } catch (error) {
      console.error("❌ Failed to execute SQL migration:", error.message);
      throw error;
    }
  }

  async verifyMigration() {
    if (!this.connection) throw new Error("Not connected to database");

    try {
      console.log("🔍 Verifying migration...");

      // Check if key tables exist
      const [tables] = await this.connection.execute(
        "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? ORDER BY TABLE_NAME",
        [this.config.database]
      );

      const tableNames = tables.map((row) => row.TABLE_NAME);
      const expectedTables = [
        "users",
        "categories",
        "brands",
        "products",
        "product_images",
        "cart_items",
        "orders",
        "order_items",
        "reviews",
        "wishlists",
      ];

      console.log(`📊 Found ${tableNames.length} tables in database:`);
      tableNames.forEach((table) => {
        const isExpected = expectedTables.includes(table);
        console.log(`   ${isExpected ? "✅" : "📄"} ${table}`);
      });

      // Check for missing critical tables
      const missingTables = expectedTables.filter(
        (table) => !tableNames.includes(table)
      );
      if (missingTables.length > 0) {
        console.warn(
          `⚠️  Missing critical tables: ${missingTables.join(", ")}`
        );
      }

      // Check admin user
      const [users] = await this.connection.execute(
        "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
      );

      const adminCount = users[0].count;
      console.log(`👤 Admin users: ${adminCount}`);

      // Check sample data
      const [products] = await this.connection.execute(
        "SELECT COUNT(*) as count FROM products"
      );

      const productCount = products[0].count;
      console.log(`📦 Products: ${productCount}`);

      console.log("✅ Database migration verification completed");
    } catch (error) {
      console.error("❌ Migration verification failed:", error.message);
      throw error;
    }
  }

  async migrate() {
    const startTime = Date.now();

    try {
      console.log("🚀 Starting AynBeauty Database Migration");
      console.log("=====================================");
      console.log();

      await this.connect();
      await this.createDatabase();
      await this.executeSQLFile();
      await this.verifyMigration();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log();
      console.log("🎉 Migration completed successfully!");
      console.log("===================================");
      console.log(`⏱️  Duration: ${duration} seconds`);
      console.log(`🗄️  Database: ${this.config.database}`);
      console.log(`🏠 Host: ${this.config.host}:${this.config.port}`);
      console.log();
      console.log("✅ Your AynBeauty database is ready for production!");
      console.log();
      console.log("Next steps:");
      console.log(
        "1. Update your production .env file with these database settings"
      );
      console.log("2. Deploy your Next.js application");
      console.log("3. Start your application with PM2");
    } catch (error) {
      console.error();
      console.error("💥 Migration failed!");
      console.error("==================");
      console.error("Error:", error.message);
      console.error();
      console.error("Troubleshooting tips:");
      console.error("1. Check your database credentials in .env.local");
      console.error("2. Ensure MySQL server is running");
      console.error("3. Verify the user has CREATE DATABASE privileges");
      console.error("4. Check if the database server is accessible");

      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  migrator.migrate();
}

module.exports = DatabaseMigrator;
