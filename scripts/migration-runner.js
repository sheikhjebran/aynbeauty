const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

class MigrationRunner {
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
    this.migrationsPath = path.join(process.cwd(), "database", "migrations");
    this.validateConfig();
  }

  validateConfig() {
    if (!this.config.user || !this.config.password) {
      console.error("❌ Database credentials not found in .env.local");
      console.error(
        "Please ensure the following environment variables are set:"
      );
      console.error("- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME");
      process.exit(1);
    }

    if (!fs.existsSync(this.migrationsPath)) {
      console.error(
        `❌ Migrations directory not found: ${this.migrationsPath}`
      );
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
        database: this.config.database,
        multipleStatements: true,
      });

      console.log("✅ Connected to MySQL successfully");
    } catch (error) {
      console.error("❌ Failed to connect to MySQL:", error.message);

      if (error.message.includes("Unknown database")) {
        console.error(`\n💡 Database '${this.config.database}' doesn't exist.`);
        console.error(
          "Please create it first or ask your hosting provider to create it."
        );
      }

      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("🔌 Disconnected from MySQL");
    }
  }

  async createMigrationsTable() {
    try {
      console.log("📋 Setting up migrations tracking table...");

      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INT PRIMARY KEY AUTO_INCREMENT,
          filename VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          batch INT NOT NULL DEFAULT 1,
          INDEX idx_filename (filename),
          INDEX idx_batch (batch)
        )
      `);

      console.log("✅ Migrations table ready");
    } catch (error) {
      console.error("❌ Failed to create migrations table:", error.message);
      throw error;
    }
  }

  async getExecutedMigrations() {
    try {
      const [rows] = await this.connection.execute(
        "SELECT filename FROM migrations ORDER BY filename"
      );
      return rows.map((row) => row.filename);
    } catch (error) {
      console.warn(
        "⚠️  Could not read migrations table, assuming no migrations executed"
      );
      return [];
    }
  }

  getPendingMigrations() {
    const files = fs.readdirSync(this.migrationsPath);

    // Get only .sql files (not .rollback.sql files)
    const migrationFiles = files
      .filter((file) => file.endsWith(".sql") && !file.includes(".rollback."))
      .sort();

    return migrationFiles;
  }

  async executeMigration(filename) {
    const filePath = path.join(this.migrationsPath, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Migration file not found: ${filePath}`);
    }

    try {
      console.log(`📄 Executing migration: ${filename}`);

      const sql = fs.readFileSync(filePath, "utf8");

      // Split SQL into individual statements and execute them
      const statements = sql
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
          console.warn(`⚠️  Warning in ${filename}: ${error.message}`);
          errorCount++;
        }
      }

      // Record migration as executed
      await this.connection.execute(
        "INSERT IGNORE INTO migrations (filename) VALUES (?)",
        [filename]
      );

      console.log(
        `✅ ${filename}: ${successCount} statements executed, ${errorCount} warnings`
      );
      return { success: true, statements: successCount, warnings: errorCount };
    } catch (error) {
      console.error(`❌ Failed to execute ${filename}:`, error.message);
      throw error;
    }
  }

  async rollbackMigration(filename) {
    const rollbackFilename = filename.replace(".sql", ".rollback.sql");
    const rollbackPath = path.join(this.migrationsPath, rollbackFilename);

    if (!fs.existsSync(rollbackPath)) {
      console.warn(`⚠️  No rollback file found for ${filename}`);
      return false;
    }

    try {
      console.log(`🔄 Rolling back migration: ${filename}`);

      const sql = fs.readFileSync(rollbackPath, "utf8");

      // Split and execute rollback statements
      const statements = sql
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        await this.connection.execute(statement);
      }

      // Remove migration record
      await this.connection.execute(
        "DELETE FROM migrations WHERE filename = ?",
        [filename]
      );

      console.log(`✅ Rolled back: ${filename}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to rollback ${filename}:`, error.message);
      throw error;
    }
  }

  async runMigrations() {
    const startTime = Date.now();

    try {
      console.log("🚀 Starting Database Migrations");
      console.log("===============================");
      console.log();

      await this.connect();
      await this.createMigrationsTable();

      const executedMigrations = await this.getExecutedMigrations();
      const allMigrations = this.getPendingMigrations();

      const pendingMigrations = allMigrations.filter(
        (migration) => !executedMigrations.includes(migration)
      );

      console.log(`📊 Migration Status:`);
      console.log(`   Total migrations: ${allMigrations.length}`);
      console.log(`   Executed: ${executedMigrations.length}`);
      console.log(`   Pending: ${pendingMigrations.length}`);
      console.log();

      if (pendingMigrations.length === 0) {
        console.log("✅ All migrations are up to date!");
        return;
      }

      console.log("🚀 Executing pending migrations...");
      console.log();

      let totalStatements = 0;
      let totalWarnings = 0;

      for (const migration of pendingMigrations) {
        const result = await this.executeMigration(migration);
        totalStatements += result.statements;
        totalWarnings += result.warnings;
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log();
      console.log("🎉 Migrations completed successfully!");
      console.log("===================================");
      console.log(`⏱️  Duration: ${duration} seconds`);
      console.log(`📊 Executed: ${pendingMigrations.length} migrations`);
      console.log(`📝 Statements: ${totalStatements} executed`);
      if (totalWarnings > 0) {
        console.log(`⚠️  Warnings: ${totalWarnings}`);
      }
      console.log(`🗄️  Database: ${this.config.database}`);
      console.log();
      console.log("✅ Your database is now up to date!");
    } catch (error) {
      console.error();
      console.error("💥 Migration failed!");
      console.error("===================");
      console.error("Error:", error.message);
      console.error();
      console.error("Troubleshooting tips:");
      console.error("1. Check your database credentials in .env.local");
      console.error("2. Ensure the database exists");
      console.error("3. Verify the user has proper permissions");
      console.error("4. Check migration file syntax");

      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }

  async showStatus() {
    try {
      await this.connect();
      await this.createMigrationsTable();

      const executedMigrations = await this.getExecutedMigrations();
      const allMigrations = this.getPendingMigrations();

      console.log("📊 Migration Status");
      console.log("==================");
      console.log();

      console.log("Executed migrations:");
      if (executedMigrations.length === 0) {
        console.log("   (none)");
      } else {
        executedMigrations.forEach((migration) => {
          console.log(`   ✅ ${migration}`);
        });
      }

      console.log();
      console.log("Pending migrations:");
      const pendingMigrations = allMigrations.filter(
        (migration) => !executedMigrations.includes(migration)
      );

      if (pendingMigrations.length === 0) {
        console.log("   (none - all up to date!)");
      } else {
        pendingMigrations.forEach((migration) => {
          console.log(`   ⏳ ${migration}`);
        });
      }

      console.log();
      console.log(
        `Total: ${allMigrations.length} migrations, ${executedMigrations.length} executed, ${pendingMigrations.length} pending`
      );
    } catch (error) {
      console.error("❌ Failed to get migration status:", error.message);
    } finally {
      await this.disconnect();
    }
  }

  async rollbackLast() {
    try {
      await this.connect();
      await this.createMigrationsTable();

      const [rows] = await this.connection.execute(
        "SELECT filename FROM migrations ORDER BY id DESC LIMIT 1"
      );

      if (rows.length === 0) {
        console.log("ℹ️  No migrations to rollback");
        return;
      }

      const lastMigration = rows[0].filename;
      console.log(`🔄 Rolling back last migration: ${lastMigration}`);

      await this.rollbackMigration(lastMigration);

      console.log("✅ Rollback completed successfully!");
    } catch (error) {
      console.error("❌ Rollback failed:", error.message);
    } finally {
      await this.disconnect();
    }
  }
}

// Command line interface
const command = process.argv[2] || "migrate";

async function main() {
  const runner = new MigrationRunner();

  switch (command) {
    case "migrate":
    case "up":
      await runner.runMigrations();
      break;

    case "status":
      await runner.showStatus();
      break;

    case "rollback":
    case "down":
      await runner.rollbackLast();
      break;

    default:
      console.log("🚀 AynBeauty Migration Runner");
      console.log("============================");
      console.log();
      console.log("Usage:");
      console.log("  npm run migrate:up      # Run pending migrations");
      console.log("  npm run migrate:status  # Show migration status");
      console.log("  npm run migrate:down    # Rollback last migration");
      console.log();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MigrationRunner;
