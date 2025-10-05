require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

class FreshMigrationRunner {
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
    this.migrationsPath = path.join(__dirname, "../database/fresh-migrations");
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

  async resetDatabase() {
    try {
      console.log("🗄️  FRESH DATABASE MIGRATION");
      console.log("============================");
      console.log();

      await this.connect();

      // Get list of migration files
      const migrationFiles = await this.getMigrationFiles();

      if (migrationFiles.length === 0) {
        console.log("❌ No fresh migration files found");
        return;
      }

      console.log(`📋 Found ${migrationFiles.length} migration files:`);
      migrationFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
      console.log();

      // Drop and recreate all tables to ensure clean state
      await this.dropAllTables();

      // Execute migrations in order
      let batch = 1;
      for (const filename of migrationFiles) {
        console.log(`🔄 Executing: ${filename}`);
        await this.executeMigration(filename, batch);
        batch++;
      }

      console.log();
      console.log("✅ Fresh database migration completed successfully!");
      console.log("==========================================");
      console.log();
      console.log("🎯 Next steps:");
      console.log("   1. Upload the fresh migration files to your server");
      console.log("   2. Run: npm run fresh:migrate");
      console.log("   3. Run: npm run admin:reset");
      console.log();
    } catch (error) {
      console.error("❌ Migration failed:", error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async getMigrationFiles() {
    try {
      const files = await fs.readdir(this.migrationsPath);
      return files.filter((file) => file.endsWith(".sql")).sort(); // Chronological order
    } catch (error) {
      console.error("❌ Error reading migration directory:", error.message);
      return [];
    }
  }

  async dropAllTables() {
    try {
      console.log("🧹 Cleaning existing tables...");

      // Disable foreign key checks
      await this.connection.execute("SET FOREIGN_KEY_CHECKS = 0");

      // Get all tables
      const [tables] = await this.connection.execute("SHOW TABLES");
      const tableNames = tables.map((row) => Object.values(row)[0]);

      // Drop each table
      for (const tableName of tableNames) {
        await this.connection.execute(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`   ✅ Dropped table: ${tableName}`);
      }

      // Re-enable foreign key checks
      await this.connection.execute("SET FOREIGN_KEY_CHECKS = 1");

      console.log("🧹 Database cleaned successfully");
      console.log();
    } catch (error) {
      console.error("❌ Error cleaning database:", error.message);
      throw error;
    }
  }

  async executeMigration(filename, batch) {
    try {
      const filePath = path.join(this.migrationsPath, filename);
      const migrationSQL = await fs.readFile(filePath, "utf8");

      // Split SQL into individual statements
      const statements = migrationSQL
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      // Execute each statement
      for (const statement of statements) {
        if (statement.length > 0) {
          await this.connection.execute(statement);
        }
      }

      // Record migration in tracking table
      try {
        await this.connection.execute(
          "INSERT INTO migrations (filename, batch) VALUES (?, ?)",
          [filename, batch]
        );
      } catch (error) {
        // Ignore if migrations table doesn't exist yet
        if (!error.message.includes("doesn't exist")) {
          throw error;
        }
      }

      console.log(`   ✅ ${filename} executed successfully`);
    } catch (error) {
      console.error(`   ❌ Failed to execute ${filename}:`, error.message);
      throw error;
    }
  }

  async showStatus() {
    try {
      await this.connect();

      console.log("📊 Current Database Status");
      console.log("=========================");
      console.log();

      // Check if migrations table exists
      const [tables] = await this.connection.execute(
        "SHOW TABLES LIKE 'migrations'"
      );

      if (tables.length === 0) {
        console.log("❌ Migrations table does not exist");
        console.log("💡 Run: npm run fresh:migrate to initialize database");
        return;
      }

      // Get executed migrations
      const [migrations] = await this.connection.execute(
        "SELECT filename, batch, executed_at FROM migrations ORDER BY executed_at"
      );

      console.log("✅ Executed Migrations:");
      migrations.forEach((migration, index) => {
        console.log(
          `   ${index + 1}. ${migration.filename} (batch ${
            migration.batch
          }) - ${migration.executed_at}`
        );
      });

      // Get table count
      const [allTables] = await this.connection.execute("SHOW TABLES");
      console.log(`\n📋 Total tables: ${allTables.length}`);

      // Check admin user
      const [adminUsers] = await this.connection.execute(
        "SELECT id, email, role FROM users WHERE role = 'admin'"
      );

      if (adminUsers.length > 0) {
        console.log(`\n👤 Admin users found: ${adminUsers.length}`);
        adminUsers.forEach((admin) => {
          console.log(`   - ${admin.email} (ID: ${admin.id})`);
        });
      } else {
        console.log("\n❌ No admin users found");
        console.log("💡 Run: npm run admin:reset to create admin user");
      }
    } catch (error) {
      console.error("❌ Error checking status:", error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2] || "reset";
  const runner = new FreshMigrationRunner();

  try {
    switch (command) {
      case "reset":
        await runner.resetDatabase();
        break;
      case "status":
        await runner.showStatus();
        break;
      default:
        console.log("Usage:");
        console.log(
          "  node scripts/fresh-migrate.js reset   - Reset database with fresh migrations"
        );
        console.log(
          "  node scripts/fresh-migrate.js status  - Show migration status"
        );
    }
  } catch (error) {
    console.error("❌ Command failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = FreshMigrationRunner;
