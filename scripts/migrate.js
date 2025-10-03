#!/usr/bin/env node

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

class MigrationRunner {
  constructor() {
    this.dbConfig = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "aynbeauty",
      charset: "utf8mb4",
      multipleStatements: true,
    };
    this.connection = null;
    this.migrationsPath = path.join(__dirname, "../database/migrations");
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.dbConfig);
      console.log("✅ Connected to database");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("✅ Disconnected from database");
    }
  }

  async createMigrationsTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        batch INT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await this.connection.execute(createTableQuery);
    console.log("✅ Migrations table ready");
  }

  async getExecutedMigrations() {
    const [rows] = await this.connection.execute(
      "SELECT filename FROM migrations ORDER BY id"
    );
    return rows.map((row) => row.filename);
  }

  async getNextBatchNumber() {
    const [rows] = await this.connection.execute(
      "SELECT COALESCE(MAX(batch), 0) + 1 as next_batch FROM migrations"
    );
    return rows[0].next_batch;
  }

  async getAllMigrationFiles() {
    if (!fs.existsSync(this.migrationsPath)) {
      fs.mkdirSync(this.migrationsPath, { recursive: true });
    }

    const files = fs
      .readdirSync(this.migrationsPath)
      .filter(
        (file) => file.endsWith(".sql") && !file.endsWith(".rollback.sql")
      )
      .sort();

    return files;
  }

  async runMigration(filename, batchNumber) {
    const filePath = path.join(this.migrationsPath, filename);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`📄 Running migration: ${filename}`);

    try {
      // Split SQL into individual statements
      const statements = sql.split(";").filter((stmt) => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          await this.connection.execute(statement);
        }
      }

      // Record migration as executed
      await this.connection.execute(
        "INSERT INTO migrations (filename, batch) VALUES (?, ?)",
        [filename, batchNumber]
      );

      console.log(`✅ Migration completed: ${filename}`);
    } catch (error) {
      console.error(`❌ Migration failed: ${filename}`, error);
      throw error;
    }
  }

  async migrate() {
    await this.connect();
    await this.createMigrationsTable();

    const allMigrations = await this.getAllMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();
    const pendingMigrations = allMigrations.filter(
      (migration) => !executedMigrations.includes(migration)
    );

    if (pendingMigrations.length === 0) {
      console.log("✅ No pending migrations");
      await this.disconnect();
      return;
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migrations:`);
    pendingMigrations.forEach((migration) => console.log(`  - ${migration}`));
    console.log("");

    const batchNumber = await this.getNextBatchNumber();

    for (const migration of pendingMigrations) {
      await this.runMigration(migration, batchNumber);
    }

    console.log(
      `\n🎉 Successfully ran ${pendingMigrations.length} migrations!`
    );
    await this.disconnect();
  }

  async rollback(steps = 1) {
    await this.connect();
    await this.createMigrationsTable();

    // Get migrations to rollback
    const [rows] = await this.connection.execute(
      `
      SELECT filename, batch FROM migrations 
      ORDER BY batch DESC, id DESC 
      LIMIT ?
    `,
      [steps]
    );

    if (rows.length === 0) {
      console.log("✅ No migrations to rollback");
      await this.disconnect();
      return;
    }

    console.log(`📋 Rolling back ${rows.length} migrations:`);
    rows.forEach((row) => console.log(`  - ${row.filename}`));
    console.log("");

    for (const row of rows) {
      await this.runRollback(row.filename);
    }

    console.log(`\n🎉 Successfully rolled back ${rows.length} migrations!`);
    await this.disconnect();
  }

  async runRollback(filename) {
    // Look for rollback file
    const rollbackFilename = filename.replace(".sql", ".rollback.sql");
    const rollbackPath = path.join(this.migrationsPath, rollbackFilename);

    if (!fs.existsSync(rollbackPath)) {
      console.log(`⚠️ No rollback file found for: ${filename}`);
      // Just remove from migrations table
      await this.connection.execute(
        "DELETE FROM migrations WHERE filename = ?",
        [filename]
      );
      return;
    }

    console.log(`📄 Rolling back: ${filename}`);

    try {
      const sql = fs.readFileSync(rollbackPath, "utf8");
      const statements = sql.split(";").filter((stmt) => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          await this.connection.execute(statement);
        }
      }

      // Remove migration record
      await this.connection.execute(
        "DELETE FROM migrations WHERE filename = ?",
        [filename]
      );

      console.log(`✅ Rollback completed: ${filename}`);
    } catch (error) {
      console.error(`❌ Rollback failed: ${filename}`, error);
      throw error;
    }
  }

  async status() {
    await this.connect();
    await this.createMigrationsTable();

    const allMigrations = await this.getAllMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();

    console.log("📊 Migration Status:\n");

    if (allMigrations.length === 0) {
      console.log("No migration files found");
      await this.disconnect();
      return;
    }

    allMigrations.forEach((migration) => {
      const status = executedMigrations.includes(migration)
        ? "✅ Executed"
        : "⏳ Pending";
      console.log(`  ${status} - ${migration}`);
    });

    console.log(
      `\nTotal: ${allMigrations.length} migrations, ${
        executedMigrations.length
      } executed, ${allMigrations.length - executedMigrations.length} pending`
    );

    await this.disconnect();
  }

  async fresh() {
    await this.connect();

    // Drop all tables
    console.log("🗑️ Dropping all tables...");
    const [tables] = await this.connection.execute(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
      [this.dbConfig.database]
    );

    if (tables.length > 0) {
      await this.connection.execute("SET FOREIGN_KEY_CHECKS = 0");
      for (const table of tables) {
        await this.connection.execute(
          `DROP TABLE IF EXISTS \`${table.table_name}\``
        );
      }
      await this.connection.execute("SET FOREIGN_KEY_CHECKS = 1");
      console.log(`✅ Dropped ${tables.length} tables`);
    }

    await this.disconnect();

    // Run all migrations fresh
    console.log("🚀 Running fresh migrations...");
    await this.migrate();
  }
}

// CLI Commands
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  const runner = new MigrationRunner();

  try {
    switch (command) {
      case "migrate":
        await runner.migrate();
        break;

      case "rollback":
        const steps = parseInt(arg) || 1;
        await runner.rollback(steps);
        break;

      case "status":
        await runner.status();
        break;

      case "fresh":
        await runner.fresh();
        break;

      default:
        console.log(`
🗄️ AYN Beauty Migration System

Usage:
  npm run migrate        - Run pending migrations
  npm run migrate:rollback [steps] - Rollback migrations (default: 1)
  npm run migrate:status - Show migration status
  npm run migrate:fresh  - Drop all tables and run fresh migrations

Examples:
  npm run migrate               # Run all pending migrations
  npm run migrate:rollback      # Rollback last migration
  npm run migrate:rollback 3    # Rollback last 3 migrations
  npm run migrate:status        # Show current status
  npm run migrate:fresh         # Fresh install
        `);
        break;
    }
  } catch (error) {
    console.error("❌ Migration command failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = MigrationRunner;
