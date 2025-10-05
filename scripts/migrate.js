require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

class MigrationRunner {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
      port: parseInt(process.env.DB_PORT || "3306"),
    };
  }

  async connect() {
    this.connection = await mysql.createConnection(this.config);
    console.log("✅ Connected to database");
  }

  async ensureMigrationsTable() {
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        batch INT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async getExecutedMigrations() {
    try {
      const [rows] = await this.connection.execute(
        "SELECT filename FROM migrations ORDER BY batch, executed_at"
      );
      return rows.map((row) => row.filename);
    } catch (error) {
      // If migrations table doesn't exist yet, return empty array
      if (error.code === "ER_NO_SUCH_TABLE") {
        return [];
      }
      throw error;
    }
  }

  async getAvailableMigrations() {
    const migrationsDir = path.join(__dirname, "..", "migrations");
    const files = await fs.readdir(migrationsDir);
    return files
      .filter((file) => file.endsWith(".sql") && !file.includes("_rollback"))
      .sort();
  }

  async executeMigrationFile(filename) {
    const migrationPath = path.join(__dirname, "..", "migrations", filename);
    const migrationSQL = await fs.readFile(migrationPath, "utf8");

    // Split SQL into statements and execute
    const statements = migrationSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        await this.connection.execute(statement);
      }
    }
  }

  async validateTableSchema(tableName, expectedSchema) {
    try {
      // Get current table structure
      const [currentColumns] = await this.connection.execute(
        `
        SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `,
        [this.config.database, tableName]
      );

      // Compare with expected schema
      if (currentColumns.length !== expectedSchema.columns.length) {
        console.log(
          `⚠️  Column count mismatch for ${tableName}: expected ${expectedSchema.columns.length}, got ${currentColumns.length}`
        );
        return false;
      }

      console.log(`✅ Table ${tableName} schema matches migration`);
      return true;
    } catch (error) {
      console.log(
        `❌ Table ${tableName} does not exist or has validation errors`
      );
      return false;
    }
  }

  async runMigrations(skipMigrationsTable = false) {
    console.log("🚀 Running migrations...");

    if (!skipMigrationsTable) {
      await this.ensureMigrationsTable();
    }

    const executed = await this.getExecutedMigrations();
    const available = await this.getAvailableMigrations();
    const pending = available.filter(
      (migration) => !executed.includes(migration)
    );

    if (pending.length === 0) {
      console.log("✅ No pending migrations");
      return;
    }

    console.log(`📋 Found ${pending.length} pending migrations:`);
    pending.forEach((migration) => console.log(`   - ${migration}`));

    let batch = 1;
    if (executed.length > 0) {
      const [batchResult] = await this.connection.execute(
        "SELECT MAX(batch) as max_batch FROM migrations"
      );
      batch = (batchResult[0].max_batch || 0) + 1;
    }

    for (const migration of pending) {
      console.log(`\n⚡ Executing: ${migration}`);

      try {
        await this.executeMigrationFile(migration);

        // Record migration (ensure migrations table exists first)
        if (skipMigrationsTable) {
          await this.ensureMigrationsTable();
          skipMigrationsTable = false; // Only skip for first migration
        }

        await this.connection.execute(
          "INSERT INTO migrations (filename, batch) VALUES (?, ?)",
          [migration, batch]
        );

        console.log(`✅ Completed: ${migration}`);
      } catch (error) {
        console.error(`❌ Failed to execute ${migration}:`, error.message);
        throw error;
      }
    }

    console.log(`\n🎉 All migrations completed successfully!`);
  }

  async rollbackLastBatch() {
    console.log("🔄 Rolling back last migration batch...");

    const [batchResult] = await this.connection.execute(
      "SELECT MAX(batch) as max_batch FROM migrations"
    );
    const lastBatch = batchResult[0].max_batch;

    if (!lastBatch) {
      console.log("✅ No migrations to rollback");
      return;
    }

    const [migrations] = await this.connection.execute(
      "SELECT filename FROM migrations WHERE batch = ? ORDER BY executed_at DESC",
      [lastBatch]
    );

    for (const migration of migrations) {
      const rollbackFile = migration.filename.replace(".sql", "_rollback.sql");
      console.log(`🔄 Rolling back: ${migration.filename}`);

      try {
        await this.executeMigrationFile(rollbackFile);
        await this.connection.execute(
          "DELETE FROM migrations WHERE filename = ?",
          [migration.filename]
        );
        console.log(`✅ Rolled back: ${migration.filename}`);
      } catch (error) {
        console.error(
          `❌ Failed to rollback ${migration.filename}:`,
          error.message
        );
        throw error;
      }
    }

    console.log("🎉 Rollback completed successfully!");
  }

  async freshMigration() {
    console.log("🆕 Running fresh migration (drop all tables)...");

    // Get all tables including migrations table
    const [tables] = await this.connection.execute(
      `
      SELECT TABLE_NAME 
      FROM information_schema.tables 
      WHERE table_schema = ?
      ORDER BY TABLE_NAME
    `,
      [this.config.database]
    );

    // Drop all tables including migrations
    await this.connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of tables) {
      await this.connection.execute(
        `DROP TABLE IF EXISTS \`${table.TABLE_NAME}\``
      );
      console.log(`🗑️  Dropped table: ${table.TABLE_NAME}`);
    }
    await this.connection.execute("SET FOREIGN_KEY_CHECKS = 1");

    // Run all migrations (skip migrations table creation initially)
    await this.runMigrations(true);
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("✅ Disconnected from database");
    }
  }
}

// CLI interface
const command = process.argv[2];

(async () => {
  const runner = new MigrationRunner();

  try {
    await runner.connect();

    switch (command) {
      case "up":
        await runner.runMigrations();
        break;
      case "down":
        await runner.rollbackLastBatch();
        break;
      case "fresh":
        await runner.freshMigration();
        break;
      case "reset":
        await runner.rollbackLastBatch();
        await runner.runMigrations();
        break;
      default:
        console.log("Available commands:");
        console.log(
          "  node scripts/migrate.js up     - Run pending migrations"
        );
        console.log("  node scripts/migrate.js down   - Rollback last batch");
        console.log(
          "  node scripts/migrate.js fresh  - Drop all tables and re-run"
        );
        console.log(
          "  node scripts/migrate.js reset  - Rollback all and re-run"
        );
        break;
    }

    await runner.disconnect();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await runner.disconnect();
    process.exit(1);
  }
})();

module.exports = MigrationRunner;
