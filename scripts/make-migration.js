#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function createMigration(name) {
  if (!name) {
    console.log("❌ Please provide a migration name");
    console.log("Usage: npm run make:migration <migration_name>");
    console.log("Example: npm run make:migration create_orders_table");
    process.exit(1);
  }

  const timestamp = generateTimestamp();
  const filename = `${timestamp}_${name}.sql`;
  const rollbackFilename = `${timestamp}_${name}.rollback.sql`;

  const migrationsDir = path.join(__dirname, "../database/migrations");

  // Create migrations directory if it doesn't exist
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  const migrationTemplate = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}
-- Description: Add your migration description here

-- ============================================
-- Add your SQL statements below
-- ============================================

-- Example: Create a new table
-- CREATE TABLE example_table (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Example: Add a column
-- ALTER TABLE existing_table ADD COLUMN new_column VARCHAR(100);

-- Example: Create an index
-- CREATE INDEX idx_example ON table_name (column_name);

-- Add your migration SQL here
`;

  const rollbackTemplate = `-- Rollback: ${name}
-- Created: ${new Date().toISOString()}
-- Description: Rollback migration for ${name}

-- ============================================
-- Add your rollback SQL statements below
-- ============================================

-- Example: Drop a table
-- DROP TABLE IF EXISTS example_table;

-- Example: Remove a column
-- ALTER TABLE existing_table DROP COLUMN new_column;

-- Example: Drop an index
-- DROP INDEX idx_example ON table_name;

-- Add your rollback SQL here
`;

  const migrationPath = path.join(migrationsDir, filename);
  const rollbackPath = path.join(migrationsDir, rollbackFilename);

  try {
    fs.writeFileSync(migrationPath, migrationTemplate);
    fs.writeFileSync(rollbackPath, rollbackTemplate);

    console.log("✅ Migration files created successfully!");
    console.log(`📄 Migration: ${filename}`);
    console.log(`📄 Rollback: ${rollbackFilename}`);
    console.log("");
    console.log("Next steps:");
    console.log("1. Edit the migration file with your SQL statements");
    console.log("2. Edit the rollback file with corresponding rollback SQL");
    console.log("3. Run: npm run migrate");
  } catch (error) {
    console.error("❌ Failed to create migration files:", error);
    process.exit(1);
  }
}

const migrationName = process.argv[2];
createMigration(migrationName);
